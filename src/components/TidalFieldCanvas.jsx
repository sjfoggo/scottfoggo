import React, { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import styles from "../css/Concepts.module.css";

const VERTEX_SHADER = `
  precision highp float;

  attribute vec2 aOcean;
  attribute float aSeed;
  attribute vec2 aTarget0;
  attribute vec2 aTarget1;
  attribute vec2 aTarget2;
  attribute vec2 aTarget3;
  attribute vec2 aTarget4;

  uniform float uTime;
  uniform float uMorph;
  uniform float uScene;
  uniform float uEnergy;
  uniform float uPixelRatio;
  uniform vec2 uPointer;

  varying float vLight;
  varying float vSignal;
  varying float vAlpha;

  vec2 sceneTarget() {
    if (uScene < 0.5) return aTarget0;
    if (uScene < 1.5) return aTarget1;
    if (uScene < 2.5) return aTarget2;
    if (uScene < 3.5) return aTarget3;
    return aTarget4;
  }

  void main() {
    float across = aOcean.x * 2.0 - 1.0;
    float depth = aOcean.y;
    float perspective = mix(0.16, 1.34, pow(depth, 1.48));
    float amplitude = 0.027 + uEnergy * 0.028;
    float time = uTime * (0.31 + uEnergy * 0.16);

    float primary = sin(across * 8.2 + depth * 19.0 - time * 1.7);
    float crossWave = sin(across * -15.0 + depth * 13.0 + time * 1.1) * 0.48;
    float swell = sin(depth * 7.0 - time * 0.54 + aSeed * 5.0) * 0.72;
    float pointerDistance = distance(vec2(across, 1.0 - depth * 2.0), uPointer);
    float pointerWake = sin(pointerDistance * 24.0 - time * 3.2)
      * exp(-pointerDistance * 2.8) * 0.012;
    float wave = (primary + crossWave + swell) * amplitude + pointerWake;

    vec2 oceanPosition = vec2(
      across * perspective * 1.2 + wave * 0.16,
      mix(0.63, -1.18, pow(depth, 0.82)) + wave * perspective * 2.2
    );

    vec2 target = sceneTarget();
    float morph = smoothstep(0.0, 1.0, uMorph);
    vec2 position = mix(oceanPosition, target, morph);
    position += vec2(wave * 0.025, wave * 0.045) * morph;

    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = mix(
      (0.62 + perspective * 1.62 + uEnergy * 0.48) * uPixelRatio,
      (1.18 + aSeed * 1.24) * uPixelRatio,
      morph
    );

    float crest = smoothstep(0.34, 1.35, primary + crossWave + swell * 0.45);
    vLight = mix(0.2 + depth * 0.34 + crest * 0.38, 0.73 + aSeed * 0.27, morph);
    vSignal = clamp(uEnergy * 0.46 + crest * 0.08 + morph * 0.035, 0.0, 1.0);
    vAlpha = mix(0.34 + depth * 0.44, 0.72 + aSeed * 0.25, morph);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying float vLight;
  varying float vSignal;
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceFromCenter = length(point);
    float edge = 1.0 - smoothstep(0.31, 0.5, distanceFromCenter);
    vec3 bone = vec3(0.88, 0.90, 0.88) * vLight;
    vec3 blue = vec3(0.19, 0.36, 1.0);
    vec3 color = mix(bone, blue, vSignal * 0.34);
    gl_FragColor = vec4(color, edge * vAlpha);
  }
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function smoothstep(min, max, value) {
  if (min === max) return value >= max ? 1 : 0;
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Unable to compile Tidal Field shader.");
  }

  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Unable to link Tidal Field shader.");
  }

  return program;
}

function createOceanGrid(columns, rows) {
  const count = columns * rows;
  const positions = new Float32Array(count * 2);
  const seeds = new Float32Array(count);
  let cursor = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      positions[cursor] = column / (columns - 1);
      positions[cursor + 1] = row / (rows - 1);
      seeds[index] = ((index * 16807) % 2147483647) / 2147483647;
      cursor += 2;
    }
  }

  return { count, positions, seeds };
}

function fitFont(context, lines, width, height) {
  let size = Math.min(width * 0.215, height * 0.285);
  const maxWidth = width * 0.82;

  context.font = `500 ${size}px "PP Mori", Arial, sans-serif`;
  while (Math.max(...lines.map((line) => context.measureText(line).width)) > maxWidth && size > 28) {
    size -= 2;
    context.font = `500 ${size}px "PP Mori", Arial, sans-serif`;
  }

  return size;
}

function createTextTarget(lines, count, viewportWidth, viewportHeight, sceneIndex) {
  const scale = Math.min(1, 1200 / viewportWidth);
  const width = Math.max(360, Math.round(viewportWidth * scale));
  const height = Math.max(500, Math.round(viewportHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const target = new Float32Array(count * 2);

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const fontSize = fitFont(context, lines, width, height);
  const lineHeight = fontSize * 0.82;
  const startY = height * 0.5 - ((lines.length - 1) * lineHeight) / 2;
  context.font = `500 ${fontSize}px "PP Mori", Arial, sans-serif`;
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + index * lineHeight);
  });

  const pixels = context.getImageData(0, 0, width, height).data;
  const samples = [];
  const step = width < 700 ? 2 : 3;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] > 96) {
        samples.push([x, y]);
      }
    }
  }

  if (samples.length === 0) return target;

  for (let index = 0; index < count; index += 1) {
    const sampleIndex = (index * 7919 + sceneIndex * 1049) % samples.length;
    const [x, y] = samples[sampleIndex];
    const jitter = (((index * 48271) % 65521) / 65521 - 0.5) * 0.0028;
    target[index * 2] = (x / width) * 2 - 1 + jitter;
    target[index * 2 + 1] = 1 - (y / height) * 2 + jitter;
  }

  return target;
}

function bindAttribute(gl, program, name, data, size, buffers) {
  const location = gl.getAttribLocation(program, name);
  const buffer = gl.createBuffer();
  buffers.push(buffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function findScene(moments, progress) {
  let scene = 0;
  let distance = Number.POSITIVE_INFINITY;

  moments.forEach((moment, index) => {
    const nextDistance = Math.abs(progress - moment.center);
    if (nextDistance < distance) {
      distance = nextDistance;
      scene = index;
    }
  });

  return scene;
}

function morphForMoment(moment, progress) {
  const [start, fullyIn, fullyOut, end] = moment.range;
  if (progress <= fullyIn) return smoothstep(start, fullyIn, progress);
  if (progress <= fullyOut) return 1;
  return 1 - smoothstep(fullyOut, end, progress);
}

function TidalFieldCanvas({ moments, onStateChange, progress, velocity }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(progress.get());
  const velocityRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerTargetRef = useRef({ x: 0, y: 0 });

  useMotionValueEvent(progress, "change", (latest) => {
    progressRef.current = latest;
  });

  useMotionValueEvent(velocity, "change", (latest) => {
    velocityRef.current = clamp(Math.abs(latest) * 2.4, 0, 1);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });

    if (!canvas || !gl) {
      onStateChange("failed");
      return undefined;
    }

    let program;
    try {
      program = createProgram(gl);
    } catch {
      onStateChange("failed");
      return undefined;
    }

    let animationFrame = 0;
    let buffers = [];
    let pointCount = 0;
    let energy = 0;
    let intro = 0;
    let ready = false;
    let disposed = false;
    const startTime = performance.now();

    const uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      morph: gl.getUniformLocation(program, "uMorph"),
      scene: gl.getUniformLocation(program, "uScene"),
      energy: gl.getUniformLocation(program, "uEnergy"),
      pixelRatio: gl.getUniformLocation(program, "uPixelRatio"),
      pointer: gl.getUniformLocation(program, "uPointer"),
    };

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    const rebuild = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.65);
      canvas.width = Math.round(bounds.width * pixelRatio);
      canvas.height = Math.round(bounds.height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);

      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      buffers = [];

      const mobile = bounds.width < 760;
      const grid = createOceanGrid(mobile ? 118 : 208, mobile ? 72 : 112);
      pointCount = grid.count;
      bindAttribute(gl, program, "aOcean", grid.positions, 2, buffers);
      bindAttribute(gl, program, "aSeed", grid.seeds, 1, buffers);

      moments.forEach((moment, index) => {
        const target = createTextTarget(
          moment.fieldText,
          pointCount,
          bounds.width,
          bounds.height,
          index,
        );
        bindAttribute(gl, program, `aTarget${index}`, target, 2, buffers);
      });

      gl.uniform1f(uniforms.pixelRatio, pixelRatio);
    };

    const render = (now) => {
      if (disposed) return;

      const elapsed = (now - startTime) / 1000;
      const currentProgress = progressRef.current;
      const scene = findScene(moments, currentProgress);
      const moment = moments[scene];
      const targetEnergy = clamp(velocityRef.current, 0, 1);
      energy += (targetEnergy - energy) * 0.055;
      intro += (1 - intro) * 0.018;

      pointerRef.current.x += (pointerTargetRef.current.x - pointerRef.current.x) * 0.035;
      pointerRef.current.y += (pointerTargetRef.current.y - pointerRef.current.y) * 0.035;

      let morph = morphForMoment(moment, currentProgress);
      if (scene === 0) morph *= intro;

      gl.clearColor(0.012, 0.025, 0.034, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.morph, morph);
      gl.uniform1f(uniforms.scene, scene);
      gl.uniform1f(uniforms.energy, energy);
      gl.uniform2f(uniforms.pointer, pointerRef.current.x, pointerRef.current.y);
      gl.drawArrays(gl.POINTS, 0, pointCount);

      if (!ready && pointCount > 0) {
        ready = true;
        onStateChange("ready");
      }

      animationFrame = requestAnimationFrame(render);
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrame);
      onStateChange("failed");
    };

    const observer = new ResizeObserver(rebuild);
    observer.observe(canvas);
    canvas.addEventListener("webglcontextlost", handleContextLost);

    const prepare = document.fonts?.ready || Promise.resolve();
    prepare.then(() => {
      if (disposed) return;
      rebuild();
      animationFrame = requestAnimationFrame(render);
    });

    return () => {
      disposed = true;
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      cancelAnimationFrame(animationFrame);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
    };
  }, [moments, onStateChange]);

  const updatePointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerTargetRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerTargetRef.current.y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2;
  };

  const resetPointer = () => {
    pointerTargetRef.current.x = 0;
    pointerTargetRef.current.y = 0;
  };

  return (
    <canvas
      className={styles.tidalCanvas}
      ref={canvasRef}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      aria-hidden="true"
    />
  );
}

export default TidalFieldCanvas;
