const SHARED_FRAGMENT_GLSL = `
  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec2 coverUv(vec2 uv, vec2 resolution, vec2 videoSize, float progress) {
    float screenAspect = resolution.x / resolution.y;
    float videoAspect = videoSize.x / videoSize.y;

    if (screenAspect > videoAspect) {
      uv.y = (uv.y - 0.5) * (videoAspect / screenAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (screenAspect / videoAspect) + 0.5;
    }

    float zoom = 1.0 + progress * 0.065;
    uv = (uv - 0.5) / zoom + 0.5;
    uv.y += mix(-0.008, 0.026, progress);
    return clamp(uv, 0.002, 0.998);
  }
`;

export const VERTEX_SHADER = `
  precision highp float;

  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const FILM_FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 vUv;
  uniform sampler2D uVideo;
  uniform vec2 uResolution;
  uniform vec2 uVideoSize;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uProgress;

  ${SHARED_FRAGMENT_GLSL}

  float statementFocus(float progress) {
    float decisions = smoothstep(0.13, 0.20, progress)
      * (1.0 - smoothstep(0.35, 0.42, progress));
    float action = smoothstep(0.38, 0.46, progress)
      * (1.0 - smoothstep(0.59, 0.66, progress));
    float together = smoothstep(0.62, 0.70, progress)
      * (1.0 - smoothstep(0.82, 0.88, progress));
    return max(decisions, max(action, together));
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uVideoSize, uProgress);
    vec2 texel = 1.25 / uVideoSize;
    float left = luminance(texture2D(uVideo, uv - vec2(texel.x, 0.0)).rgb);
    float right = luminance(texture2D(uVideo, uv + vec2(texel.x, 0.0)).rgb);
    float below = luminance(texture2D(uVideo, uv - vec2(0.0, texel.y)).rgb);
    float above = luminance(texture2D(uVideo, uv + vec2(0.0, texel.y)).rgb);
    vec2 flow = vec2(right - left, above - below);

    uv += flow * 0.0055 * statementFocus(uProgress);

    vec2 pointerUv = uPointer * 0.5 + 0.5;
    vec2 fromPointer = vUv - pointerUv;
    float pointerFalloff = exp(-dot(fromPointer, fromPointer) * 18.0)
      * uPointerActive;
    uv += normalize(fromPointer + vec2(0.0001)) * pointerFalloff * 0.0018;
    uv = clamp(uv, 0.002, 0.998);

    float gray = luminance(texture2D(uVideo, uv).rgb);
    gray = pow(smoothstep(0.055, 0.91, gray), 1.08);
    vec3 color = vec3(gray * 0.68);

    float vignette = smoothstep(0.82, 0.24, distance(vUv, vec2(0.5)));
    color *= mix(0.63, 1.0, vignette);
    color *= mix(0.93, 0.82, uProgress);
    gl_FragColor = vec4(color, 1.0);
  }
`;
