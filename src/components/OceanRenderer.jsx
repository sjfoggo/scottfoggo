import React, { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import styles from "../css/OceanExperience.module.css";
import {
  ACCUMULATION_FRAGMENT_SHADER,
  FILM_FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "../rendering/oceanShaders";
import {
  bindTexture,
  createProgram,
  createRenderTarget,
  createTexture,
  deleteRenderTargets,
} from "../rendering/webgl";

const MOBILE_BREAKPOINT = 760;
const FULLSCREEN_QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

export function getNameLayout(width, height) {
  const mobile = width < MOBILE_BREAKPOINT;

  return {
    centerY: height * (mobile ? 0.51 : 0.54),
    fontSize: Math.min(
      width * (mobile ? 0.2 : 0.145),
      height * (mobile ? 0.15 : 0.205),
    ),
    lines: mobile ? ["SCOTT", "FOGGO"] : ["SCOTT FOGGO"],
    maxWidth: width * (mobile ? 0.78 : 0.9),
  };
}

function createNameMask(width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const layout = getNameLayout(width, height);
  let { fontSize } = layout;

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const setFont = () => {
    context.font = `500 ${fontSize}px "PP Mori", Arial, sans-serif`;
  };

  setFont();
  while (
    Math.max(...layout.lines.map((line) => context.measureText(line).width)) >
      layout.maxWidth &&
    fontSize > 28
  ) {
    fontSize -= 2;
    setFont();
  }

  const lineHeight = fontSize * 0.86;
  const startY = layout.centerY - ((layout.lines.length - 1) * lineHeight) / 2;
  layout.lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + lineHeight * index);
  });

  return canvas;
}

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
    names.map((name) => [name, gl.getUniformLocation(program, `u${name[0].toUpperCase()}${name.slice(1)}`)]),
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

    let accumulationProgram;
    let filmProgram;
    try {
      accumulationProgram = createProgram(
        gl,
        VERTEX_SHADER,
        ACCUMULATION_FRAGMENT_SHADER,
      );
      filmProgram = createProgram(gl, VERTEX_SHADER, FILM_FRAGMENT_SHADER);
    } catch {
      onStatusChange("failed");
      return undefined;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);

    const positionLocations = {
      accumulation: gl.getAttribLocation(accumulationProgram, "aPosition"),
      film: gl.getAttribLocation(filmProgram, "aPosition"),
    };
    const accumulationUniforms = getUniformLocations(gl, accumulationProgram, [
      "previous",
      "video",
      "mask",
      "resolution",
      "videoSize",
      "progress",
      "frameScale",
    ]);
    const filmUniforms = getUniformLocations(gl, filmProgram, [
      "video",
      "exposure",
      "mask",
      "resolution",
      "videoSize",
      "pointer",
      "pointerActive",
      "progress",
      "heroTime",
    ]);

    const videoTexture = createTexture(gl);
    const maskTexture = createTexture(gl);
    let renderTargets = [];
    let readIndex = 0;
    let writeIndex = 1;
    let animationFrame = 0;
    let videoFrameCallback = 0;
    let videoDirty = true;
    let started = false;
    let disposed = false;
    let failed = false;
    let ready = false;
    let lastFrameAt = performance.now();
    let heroStartedAt = performance.now();

    const drawQuad = (positionLocation) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const rebuild = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const size = getRenderSize(canvas);
      canvas.width = size.width;
      canvas.height = size.height;

      deleteRenderTargets(gl, renderTargets);
      renderTargets = [
        createRenderTarget(gl, size.width, size.height),
        createRenderTarget(gl, size.width, size.height),
      ];
      readIndex = 0;
      writeIndex = 1;

      renderTargets.forEach(({ framebuffer }) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, size.width, size.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });

      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        createNameMask(size.width, size.height),
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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

    const render = (now) => {
      if (disposed || failed) return;

      try {
        const frameScale = clamp((now - lastFrameAt) / 16.667, 0.5, 2);
        lastFrameAt = now;

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

        let exposureTexture = renderTargets[readIndex].texture;
        const developingName = progressRef.current < 0.18;

        if (developingName) {
          gl.bindFramebuffer(
            gl.FRAMEBUFFER,
            renderTargets[writeIndex].framebuffer,
          );
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.useProgram(accumulationProgram);
          bindTexture(
            gl,
            renderTargets[readIndex].texture,
            0,
            accumulationUniforms.previous,
          );
          bindTexture(gl, videoTexture, 1, accumulationUniforms.video);
          bindTexture(gl, maskTexture, 2, accumulationUniforms.mask);
          gl.uniform2f(
            accumulationUniforms.resolution,
            canvas.width,
            canvas.height,
          );
          gl.uniform2f(
            accumulationUniforms.videoSize,
            video.videoWidth,
            video.videoHeight,
          );
          gl.uniform1f(accumulationUniforms.progress, progressRef.current);
          gl.uniform1f(accumulationUniforms.frameScale, frameScale);
          drawQuad(positionLocations.accumulation);
          exposureTexture = renderTargets[writeIndex].texture;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(filmProgram);
        bindTexture(gl, videoTexture, 0, filmUniforms.video);
        bindTexture(gl, exposureTexture, 1, filmUniforms.exposure);
        bindTexture(gl, maskTexture, 2, filmUniforms.mask);
        gl.uniform2f(filmUniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(
          filmUniforms.videoSize,
          video.videoWidth,
          video.videoHeight,
        );
        gl.uniform2f(
          filmUniforms.pointer,
          pointerRef.current.x,
          pointerRef.current.y,
        );
        gl.uniform1f(filmUniforms.pointerActive, pointerRef.current.active);
        gl.uniform1f(filmUniforms.progress, progressRef.current);
        gl.uniform1f(filmUniforms.heroTime, (now - heroStartedAt) / 1000);
        drawQuad(positionLocations.film);

        if (developingName) {
          [readIndex, writeIndex] = [writeIndex, readIndex];
        }

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

      Promise.resolve(document.fonts?.ready).then(() => {
        if (disposed) return;

        try {
          rebuild();
          if (video.requestVideoFrameCallback) {
            videoFrameCallback = video.requestVideoFrameCallback(markVideoFrame);
          }
          heroStartedAt = performance.now();
          lastFrameAt = heroStartedAt;
          animationFrame = requestAnimationFrame(render);
        } catch {
          fail();
        }
      });
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      fail();
    };

    const observer = new ResizeObserver(rebuild);
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
      deleteRenderTargets(gl, renderTargets);
      gl.deleteTexture(videoTexture);
      gl.deleteTexture(maskTexture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(accumulationProgram);
      gl.deleteProgram(filmProgram);
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
