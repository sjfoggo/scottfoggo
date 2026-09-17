import React, { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import styles from "../css/Concepts.module.css";

const VERTEX_SHADER = `
  precision highp float;

  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const ACCUMULATION_SHADER = `
  precision mediump float;

  varying vec2 vUv;
  uniform sampler2D uPrevious;
  uniform sampler2D uVideo;
  uniform sampler2D uMask;
  uniform vec2 uResolution;
  uniform vec2 uVideoSize;
  uniform float uProgress;
  uniform float uFrameScale;

  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / uResolution.y;
    float videoAspect = uVideoSize.x / uVideoSize.y;

    if (screenAspect > videoAspect) {
      uv.y = (uv.y - 0.5) * (videoAspect / screenAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (screenAspect / videoAspect) + 0.5;
    }

    float zoom = 1.0 + uProgress * 0.065;
    uv = (uv - 0.5) / zoom + 0.5;
    uv.y += mix(-0.008, 0.026, uProgress);
    return clamp(uv, 0.002, 0.998);
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 texel = 1.5 / uVideoSize;
    float center = luminance(texture2D(uVideo, uv).rgb);
    float horizontal = (
      luminance(texture2D(uVideo, uv + vec2(texel.x, 0.0)).rgb) +
      luminance(texture2D(uVideo, uv - vec2(texel.x, 0.0)).rgb)
    ) * 0.5;
    float vertical = (
      luminance(texture2D(uVideo, uv + vec2(0.0, texel.y)).rgb) +
      luminance(texture2D(uVideo, uv - vec2(0.0, texel.y)).rgb)
    ) * 0.5;
    float crest = smoothstep(0.01, 0.12, max(0.0, center - (horizontal + vertical) * 0.5));
    float mask = texture2D(uMask, vUv).r;
    float previous = texture2D(uPrevious, vUv).r;
    float deposit = (0.0035 + crest * 0.045) * uFrameScale;
    float exposure = min(1.0, previous + (1.0 - previous) * deposit);
    exposure *= mask;
    gl_FragColor = vec4(vec3(exposure), 1.0);
  }
`;

const FILM_SHADER = `
  precision mediump float;

  varying vec2 vUv;
  uniform sampler2D uVideo;
  uniform sampler2D uExposure;
  uniform vec2 uResolution;
  uniform vec2 uVideoSize;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uProgress;

  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / uResolution.y;
    float videoAspect = uVideoSize.x / uVideoSize.y;

    if (screenAspect > videoAspect) {
      uv.y = (uv.y - 0.5) * (videoAspect / screenAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (screenAspect / videoAspect) + 0.5;
    }

    float zoom = 1.0 + uProgress * 0.065;
    uv = (uv - 0.5) / zoom + 0.5;
    uv.y += mix(-0.008, 0.026, uProgress);
    return clamp(uv, 0.002, 0.998);
  }

  float chapterFocus(float progress) {
    float semantic = smoothstep(0.38, 0.45, progress)
      * (1.0 - smoothstep(0.56, 0.635, progress));
    float metric = smoothstep(0.61, 0.69, progress)
      * (1.0 - smoothstep(0.80, 0.87, progress));
    return max(semantic, metric);
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 texel = 1.25 / uVideoSize;
    float left = luminance(texture2D(uVideo, uv - vec2(texel.x, 0.0)).rgb);
    float right = luminance(texture2D(uVideo, uv + vec2(texel.x, 0.0)).rgb);
    float below = luminance(texture2D(uVideo, uv - vec2(0.0, texel.y)).rgb);
    float above = luminance(texture2D(uVideo, uv + vec2(0.0, texel.y)).rgb);
    vec2 flow = vec2(right - left, above - below);

    float focus = chapterFocus(uProgress);
    uv += flow * 0.0055 * focus;

    vec2 pointerUv = uPointer * 0.5 + 0.5;
    vec2 fromPointer = vUv - pointerUv;
    float pointerFalloff = exp(-dot(fromPointer, fromPointer) * 18.0) * uPointerActive;
    uv += normalize(fromPointer + vec2(0.0001)) * pointerFalloff * 0.0018;
    uv = clamp(uv, 0.002, 0.998);

    vec3 source = texture2D(uVideo, uv).rgb;
    float gray = luminance(source);
    gray = smoothstep(0.055, 0.91, gray);
    gray = pow(gray, 1.08);
    vec3 color = vec3(gray * 0.68);

    float developedName = texture2D(uExposure, vUv).r;
    float heroPresence = 1.0 - smoothstep(0.075, 0.155, uProgress);
    vec3 exposedType = min(vec3(0.92), color * 0.48 + vec3(0.62));
    color = mix(color, exposedType, developedName * heroPresence);

    float vignette = smoothstep(0.82, 0.24, distance(vUv, vec2(0.5, 0.5)));
    color *= mix(0.63, 1.0, vignette);
    color *= mix(0.93, 0.82, uProgress);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Unable to compile the ocean renderer.");
  }

  return shader;
}

function createProgram(gl, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Unable to link the ocean renderer.");
  }

  return program;
}

function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

function createRenderTarget(gl, width, height) {
  const texture = createTexture(gl);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    throw new Error("Unable to create the ocean exposure buffer.");
  }

  return { framebuffer, texture };
}

function buildNameMask(width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const mobile = width < 760;
  const lines = mobile ? ["SCOTT", "FOGGO"] : ["SCOTT FOGGO"];
  const maxWidth = width * (mobile ? 0.84 : 0.9);
  let fontSize = Math.min(width * (mobile ? 0.24 : 0.145), height * (mobile ? 0.18 : 0.205));

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `500 ${fontSize}px "PP Mori", Arial, sans-serif`;

  while (Math.max(...lines.map((line) => context.measureText(line).width)) > maxWidth && fontSize > 28) {
    fontSize -= 2;
    context.font = `500 ${fontSize}px "PP Mori", Arial, sans-serif`;
  }

  const lineHeight = fontSize * 0.84;
  const centerY = height * (mobile ? 0.52 : 0.54);
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + lineHeight * index);
  });

  return canvas;
}

function bindTexture(gl, texture, unit, location) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(location, unit);
}

function OceanFilmCanvas({ onStateChange, progress, videoRef }) {
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
      onStateChange("failed");
      return undefined;
    }

    let accumulationProgram;
    let filmProgram;
    try {
      accumulationProgram = createProgram(gl, ACCUMULATION_SHADER);
      filmProgram = createProgram(gl, FILM_SHADER);
    } catch {
      onStateChange("failed");
      return undefined;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const videoTexture = createTexture(gl);
    const maskTexture = createTexture(gl);
    let targets = [];
    let exposureWidth = 0;
    let exposureHeight = 0;
    let readIndex = 0;
    let writeIndex = 1;
    let animationFrame = 0;
    let videoFrameCallback = 0;
    let videoDirty = true;
    let ready = false;
    let started = false;
    let disposed = false;
    let failed = false;
    let lastTime = performance.now();

    const accumulationUniforms = {
      previous: gl.getUniformLocation(accumulationProgram, "uPrevious"),
      video: gl.getUniformLocation(accumulationProgram, "uVideo"),
      mask: gl.getUniformLocation(accumulationProgram, "uMask"),
      resolution: gl.getUniformLocation(accumulationProgram, "uResolution"),
      videoSize: gl.getUniformLocation(accumulationProgram, "uVideoSize"),
      progress: gl.getUniformLocation(accumulationProgram, "uProgress"),
      frameScale: gl.getUniformLocation(accumulationProgram, "uFrameScale"),
    };
    const filmUniforms = {
      video: gl.getUniformLocation(filmProgram, "uVideo"),
      exposure: gl.getUniformLocation(filmProgram, "uExposure"),
      resolution: gl.getUniformLocation(filmProgram, "uResolution"),
      videoSize: gl.getUniformLocation(filmProgram, "uVideoSize"),
      pointer: gl.getUniformLocation(filmProgram, "uPointer"),
      pointerActive: gl.getUniformLocation(filmProgram, "uPointerActive"),
      progress: gl.getUniformLocation(filmProgram, "uProgress"),
    };

    const drawQuad = (program) => {
      const position = gl.getAttribLocation(program, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const destroyTargets = () => {
      targets.forEach(({ framebuffer, texture }) => {
        gl.deleteFramebuffer(framebuffer);
        gl.deleteTexture(texture);
      });
      targets = [];
    };

    const rebuild = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const mobile = bounds.width < 760;
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        mobile ? 1.2 : 1.5,
        (mobile ? 900 : 1920) / bounds.width,
      );
      canvas.width = Math.round(bounds.width * pixelRatio);
      canvas.height = Math.round(bounds.height * pixelRatio);

      const exposureScale = Math.min(1, (mobile ? 640 : 960) / bounds.width);
      exposureWidth = Math.max(320, Math.round(bounds.width * exposureScale));
      exposureHeight = Math.max(360, Math.round(bounds.height * exposureScale));
      destroyTargets();
      targets = [
        createRenderTarget(gl, exposureWidth, exposureHeight),
        createRenderTarget(gl, exposureWidth, exposureHeight),
      ];
      readIndex = 0;
      writeIndex = 1;

      targets.forEach(({ framebuffer }) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, exposureWidth, exposureHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });

      const mask = buildNameMask(exposureWidth, exposureHeight);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        mask,
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
      onStateChange("failed");
      cancelAnimationFrame(animationFrame);
    };

    const render = (now) => {
      if (disposed || failed) return;

      try {
        const frameScale = clamp((now - lastTime) / 16.667, 0.5, 2);
        lastTime = now;

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

        pointerRef.current.x += (pointerTargetRef.current.x - pointerRef.current.x) * 0.045;
        pointerRef.current.y += (pointerTargetRef.current.y - pointerRef.current.y) * 0.045;
        pointerRef.current.active += (pointerTargetRef.current.active - pointerRef.current.active) * 0.045;

        let exposureTexture = targets[readIndex].texture;
        const developingName = progressRef.current < 0.18;

        if (developingName) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, targets[writeIndex].framebuffer);
          gl.viewport(0, 0, exposureWidth, exposureHeight);
          gl.useProgram(accumulationProgram);
          bindTexture(gl, targets[readIndex].texture, 0, accumulationUniforms.previous);
          bindTexture(gl, videoTexture, 1, accumulationUniforms.video);
          bindTexture(gl, maskTexture, 2, accumulationUniforms.mask);
          gl.uniform2f(accumulationUniforms.resolution, exposureWidth, exposureHeight);
          gl.uniform2f(accumulationUniforms.videoSize, video.videoWidth, video.videoHeight);
          gl.uniform1f(accumulationUniforms.progress, progressRef.current);
          gl.uniform1f(accumulationUniforms.frameScale, frameScale);
          drawQuad(accumulationProgram);
          exposureTexture = targets[writeIndex].texture;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(filmProgram);
        bindTexture(gl, videoTexture, 0, filmUniforms.video);
        bindTexture(gl, exposureTexture, 1, filmUniforms.exposure);
        gl.uniform2f(filmUniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(filmUniforms.videoSize, video.videoWidth, video.videoHeight);
        gl.uniform2f(filmUniforms.pointer, pointerRef.current.x, pointerRef.current.y);
        gl.uniform1f(filmUniforms.pointerActive, pointerRef.current.active);
        gl.uniform1f(filmUniforms.progress, progressRef.current);
        drawQuad(filmProgram);

        if (developingName) {
          const previousRead = readIndex;
          readIndex = writeIndex;
          writeIndex = previousRead;
        }

        if (!ready) {
          ready = true;
          onStateChange("ready");
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
          lastTime = performance.now();
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
    video.play().catch(() => undefined);
    begin();

    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener("loadeddata", begin);
      video.removeEventListener("canplay", begin);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      cancelAnimationFrame(animationFrame);
      if (videoFrameCallback && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(videoFrameCallback);
      }
      destroyTargets();
      gl.deleteTexture(videoTexture);
      gl.deleteTexture(maskTexture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(accumulationProgram);
      gl.deleteProgram(filmProgram);
    };
  }, [onStateChange, videoRef]);

  const updatePointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerTargetRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerTargetRef.current.y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2;
    pointerTargetRef.current.active = 1;
  };

  const resetPointer = () => {
    pointerTargetRef.current.active = 0;
  };

  return (
    <canvas
      className={styles.oceanCanvas}
      ref={canvasRef}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      aria-hidden="true"
    />
  );
}

export default OceanFilmCanvas;
