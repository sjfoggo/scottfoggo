import React, { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import styles from "../css/OceanExperience.module.css";
import {
  FILM_FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "../rendering/oceanShaders";
import {
  bindTexture,
  createProgram,
  createTexture,
} from "../rendering/webgl";

const MOBILE_BREAKPOINT = 760;
const FULLSCREEN_QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

function getRenderSize(canvas) {
  const bounds = canvas.getBoundingClientRect();
  const mobile = bounds.width < MOBILE_BREAKPOINT;
  const maximumWidth = mobile ? 900 : 1920;
  const maximumHeight = mobile ? 1600 : 1080;
  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    1.5,
    maximumWidth / bounds.width,
    maximumHeight / bounds.height,
  );

  return {
    height: Math.round(bounds.height * pixelRatio),
    width: Math.round(bounds.width * pixelRatio),
  };
}

function getUniformLocations(gl, program, names) {
  return Object.fromEntries(
    names.map((name) => [
      name,
      gl.getUniformLocation(
        program,
        `u${name[0].toUpperCase()}${name.slice(1)}`,
      ),
    ]),
  );
}

function OceanRenderer({ onStatusChange, progress, videoRef }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(progress.get());
  const pointerRef = useRef({ x: 0, y: 0, active: 0 });
  const pointerTargetRef = useRef({ x: 0, y: 0, active: 0 });

  useMotionValueEvent(progress, "change", (latest) => {
    progressRef.current = latest;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    if (!canvas || !video || !gl) {
      onStatusChange("failed");
      return undefined;
    }

    let program;
    try {
      program = createProgram(gl, VERTEX_SHADER, FILM_FRAGMENT_SHADER);
    } catch {
      onStatusChange("failed");
      return undefined;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const uniforms = getUniformLocations(gl, program, [
      "video",
      "resolution",
      "videoSize",
      "pointer",
      "pointerActive",
      "progress",
    ]);
    const videoTexture = createTexture(gl);

    let animationFrame = 0;
    let videoFrameCallback = 0;
    let videoDirty = true;
    let started = false;
    let disposed = false;
    let failed = false;
    let ready = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const size = getRenderSize(canvas);
      canvas.width = size.width;
      canvas.height = size.height;
    };

    const markVideoFrame = () => {
      if (disposed) return;
      videoDirty = true;
      videoFrameCallback = video.requestVideoFrameCallback(markVideoFrame);
    };

    const fail = () => {
      if (failed) return;
      failed = true;
      onStatusChange("failed");
      cancelAnimationFrame(animationFrame);
    };

    const render = () => {
      if (disposed || failed) return;

      try {
        if (videoDirty || !video.requestVideoFrameCallback) {
          gl.bindTexture(gl.TEXTURE_2D, videoTexture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
          videoDirty = false;
        }

        pointerRef.current.x +=
          (pointerTargetRef.current.x - pointerRef.current.x) * 0.045;
        pointerRef.current.y +=
          (pointerTargetRef.current.y - pointerRef.current.y) * 0.045;
        pointerRef.current.active +=
          (pointerTargetRef.current.active - pointerRef.current.active) * 0.045;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        bindTexture(gl, videoTexture, 0, uniforms.video);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(
          uniforms.videoSize,
          video.videoWidth,
          video.videoHeight,
        );
        gl.uniform2f(
          uniforms.pointer,
          pointerRef.current.x,
          pointerRef.current.y,
        );
        gl.uniform1f(uniforms.pointerActive, pointerRef.current.active);
        gl.uniform1f(uniforms.progress, progressRef.current);

        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (!ready) {
          ready = true;
          onStatusChange("ready");
        }
      } catch {
        fail();
        return;
      }

      animationFrame = requestAnimationFrame(render);
    };

    const begin = () => {
      if (started || disposed || video.readyState < 2) return;
      started = true;

      try {
        resize();
        if (video.requestVideoFrameCallback) {
          videoFrameCallback = video.requestVideoFrameCallback(markVideoFrame);
        }
        animationFrame = requestAnimationFrame(render);
      } catch {
        fail();
      }
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      fail();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    video.addEventListener("loadeddata", begin);
    video.addEventListener("canplay", begin);
    video.addEventListener("error", fail);
    video.play().catch(() => undefined);
    begin();

    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener("loadeddata", begin);
      video.removeEventListener("canplay", begin);
      video.removeEventListener("error", fail);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      cancelAnimationFrame(animationFrame);
      if (videoFrameCallback && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(videoFrameCallback);
      }
      gl.deleteTexture(videoTexture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
    };
  }, [onStatusChange, videoRef]);

  const updatePointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerTargetRef.current.x =
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerTargetRef.current.y =
      1 - ((event.clientY - bounds.top) / bounds.height) * 2;
    pointerTargetRef.current.active = 1;
  };

  const resetPointer = () => {
    pointerTargetRef.current.active = 0;
  };

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      aria-hidden="true"
    />
  );
}

export default OceanRenderer;
