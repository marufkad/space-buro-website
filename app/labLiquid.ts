/**
 * Cursor-reactive liquid reveal. The canvas is opaque paper with transparent
 * fluid-shaped holes; an ordinary image below it keeps the photograph undistorted.
 * Behaviour reference: Framer University's Hover Mask Reveal used by Avéon.
 * Local WebGL implementation, with no runtime dependency on Framer or Three.js.
 */
export type LiquidController = {
  setImage: (src: string) => void;
  setEnabled: (enabled: boolean) => void;
  setVisible: (visible: boolean) => void;
  pulse: (x: number, y: number, strength?: number, input?: "mouse" | "touch") => void;
  release: () => void;
  resize: () => void;
  destroy: () => void;
};

type Field = { texture: WebGLTexture; framebuffer: WebGLFramebuffer };
type Shader = { program: WebGLProgram; locations: Map<string, WebGLUniformLocation | null> };
type Uniform = number | readonly number[] | WebGLTexture;
const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));
const paperColor = "#f8f7f4";
const vertex = `#version 300 es
out vec2 uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
const fragment = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 color;
`;

/*
 * Simplex noise below: Copyright (C) 2011 Ashima Arts. All rights reserved.
 * https://github.com/ashima/webgl-noise
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions: The above copyright notice and this
 * permission notice shall be included in all copies or substantial portions of
 * the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
const noise = `vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }
`;

const splatFragment = `${fragment}
uniform sampler2D source;
uniform vec2 point;
uniform vec2 amount;
uniform float aspect;
uniform float radius;
void main() {
  vec2 distance = (uv - point) * vec2(max(aspect, 1.0), max(1.0 / aspect, 1.0));
  float drop = exp(-dot(distance, distance) / (radius * radius));
  color = texture(source, uv) + vec4(amount * drop, 0.0, 0.0);
}`;
const advectionFragment = `${fragment}
uniform sampler2D flow;
uniform sampler2D source;
uniform vec2 texel;
uniform float delta;
uniform float decay;
void main() {
  vec2 velocity = texture(flow, uv).xy;
  color = texture(source, uv - velocity * texel * delta) * decay;
}`;
const curlFragment = `${fragment}
uniform sampler2D flow;
uniform vec2 texel;
void main() {
  float left = texture(flow, uv - vec2(texel.x, 0.0)).y;
  float right = texture(flow, uv + vec2(texel.x, 0.0)).y;
  float top = texture(flow, uv + vec2(0.0, texel.y)).x;
  float bottom = texture(flow, uv - vec2(0.0, texel.y)).x;
  vec2 velocity = texture(flow, uv).xy;
  velocity += 0.00045 * vec2(top - bottom, left - right);
  color = vec4(velocity, 0.0, 1.0);
}`;
const divergenceFragment = `${fragment}
uniform sampler2D flow;
uniform vec2 texel;
void main() {
  float left = texture(flow, uv - vec2(texel.x, 0.0)).x;
  float right = texture(flow, uv + vec2(texel.x, 0.0)).x;
  float top = texture(flow, uv + vec2(0.0, texel.y)).y;
  float bottom = texture(flow, uv - vec2(0.0, texel.y)).y;
  color = vec4((right - left + top - bottom) * 0.5, 0.0, 0.0, 1.0);
}`;
const pressureFragment = `${fragment}
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 texel;
void main() {
  float neighbours = texture(pressure, uv - vec2(texel.x, 0.0)).r
    + texture(pressure, uv + vec2(texel.x, 0.0)).r
    + texture(pressure, uv - vec2(0.0, texel.y)).r
    + texture(pressure, uv + vec2(0.0, texel.y)).r;
  color = vec4((neighbours - texture(divergence, uv).r) * 0.25, 0.0, 0.0, 1.0);
}`;
const projectionFragment = `${fragment}
uniform sampler2D flow;
uniform sampler2D pressure;
uniform vec2 texel;
void main() {
  vec2 gradient = vec2(
    texture(pressure, uv + vec2(texel.x, 0.0)).r - texture(pressure, uv - vec2(texel.x, 0.0)).r,
    texture(pressure, uv + vec2(0.0, texel.y)).r - texture(pressure, uv - vec2(0.0, texel.y)).r
  );
  color = vec4(texture(flow, uv).xy - gradient * 0.5, 0.0, 1.0);
}`;
const revealFragment = `${fragment}
${noise}
uniform sampler2D density;
uniform float clock;
uniform float progress;
void main() {
  // Match Avéon's .7 edge grain, .5 strength and 5 time speed controls.
  float time = clock * 0.5;
  vec2 noiseUV = vec2(uv.x + time * 0.1 + sin(uv.y + time * 0.1),
                     uv.y - cos(time * 0.001) * 0.01);
  float frequency = 10.4 / 0.51;
  float fine = snoise(vec3(noiseUV * frequency, time)) - 1.0;
  float broad = snoise(vec3(noiseUV * frequency * 0.5, time * 0.7)) - 1.0;
  float grain = (fine + broad * 0.5) * 0.7;
  float ink = max(0.0, texture(density, uv).r * 2.25 * progress);
  float mask = smoothstep(0.35, 0.55, pow(ink, 1.5) + grain * 2.1);
  // Only paper is drawn here. Transparent holes expose the real photograph below.
  float alpha = 1.0 - (mask < 0.01 ? 0.0 : mask);
  color = vec4(vec3(248.0, 247.0, 244.0) / 255.0 * alpha, alpha);
}`;

function createWebGLLiquid(host: HTMLElement, canvas: HTMLCanvasElement): LiquidController | null {
  let context: WebGL2RenderingContext | null;
  try {
    context = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: "low-power" });
  } catch { return null; }
  if (!context || !context.getExtension("EXT_color_buffer_float")) return null;
  const gl = context;
  const shaders: Shader[] = [];
  let fields: Field[] = [];
  let width = 1, height = 1, simWidth = 1, simHeight = 1;
  let enabled = true, visible = true, disposed = false;
  let raf = 0, requestId = 0, imageReady = false;
  let previousTime = 0, elapsed = 0, progress = 0, lastPulse = -Infinity;
  let pointerStrength = 1, touchPulse = false, pulseDuration = 100, freshPoint = true, mouseHeld = false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  let point = [0.5, 0.5], previousPoint = [0.5, 0.5];
  let velocity: Field, velocityNext: Field, density: Field, densityNext: Field;
  let pressure: Field, pressureNext: Field, divergence: Field;
  const cache = new Map<string, HTMLImageElement>();

  function compile(type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Shader unavailable");
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error("Shader compilation failed"); }
    return shader;
  }
  function program(source: string): Shader {
    const vert = compile(gl.VERTEX_SHADER, vertex);
    let frag: WebGLShader | null = null;
    try {
      frag = compile(gl.FRAGMENT_SHADER, source);
      const item = gl.createProgram();
      if (!item) throw new Error("Program unavailable");
      gl.attachShader(item, vert); gl.attachShader(item, frag); gl.linkProgram(item);
      if (!gl.getProgramParameter(item, gl.LINK_STATUS)) { gl.deleteProgram(item); throw new Error("Program linking failed"); }
      const result = { program: item, locations: new Map<string, WebGLUniformLocation | null>() };
      shaders.push(result); return result;
    } finally { gl.deleteShader(vert); if (frag) gl.deleteShader(frag); }
  }
  function textureSettings() {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  function field(): Field {
    const texture = gl.createTexture(), framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      throw new Error("Framebuffer unavailable");
    }
    gl.bindTexture(gl.TEXTURE_2D, texture); textureSettings();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simWidth, simHeight, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteTexture(texture); gl.deleteFramebuffer(framebuffer); throw new Error("Float framebuffer unavailable");
    }
    const result = { texture, framebuffer }; fields.push(result); return result;
  }
  function releaseFields() {
    for (const value of fields) { gl.deleteTexture(value.texture); gl.deleteFramebuffer(value.framebuffer); }
    fields = [];
  }
  function draw(shader: Shader, target: Field | null, uniforms: Record<string, Uniform>) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer || null);
    gl.viewport(0, 0, target ? simWidth : canvas.width, target ? simHeight : canvas.height);
    gl.useProgram(shader.program);
    let unit = 0;
    for (const [name, value] of Object.entries(uniforms)) {
      if (!shader.locations.has(name)) shader.locations.set(name, gl.getUniformLocation(shader.program, name));
      const location = shader.locations.get(name)!;
      if (typeof value === "number") gl.uniform1f(location, value);
      else if (Array.isArray(value)) gl.uniform2f(location, value[0], value[1]);
      else { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, value as WebGLTexture); gl.uniform1i(location, unit++); }
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function cover() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (enabled) gl.clearColor(248 / 255, 247 / 255, 244 / 255, 1);
    else gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  function clear() {
    cancelAnimationFrame(raf); raf = 0; previousTime = 0; progress = 0; lastPulse = -Infinity; freshPoint = true; mouseHeld = false;
    if (gl.isContextLost()) return;
    gl.clearColor(0, 0, 0, 0);
    for (const value of fields) { gl.bindFramebuffer(gl.FRAMEBUFFER, value.framebuffer); gl.clear(gl.COLOR_BUFFER_BIT); }
    cover();
  }
  function resize() {
    if (disposed || gl.isContextLost()) return;
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5, (coarse ? 1600 : 2560) / Math.max(width, height));
    const displayWidth = Math.max(1, Math.round(width * dpr)), displayHeight = Math.max(1, Math.round(height * dpr));
    // Reassigning either dimension clears the display even when it has not changed.
    const displayChanged = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (canvas.width !== displayWidth) canvas.width = displayWidth;
    if (canvas.height !== displayHeight) canvas.height = displayHeight;
    if (displayChanged) cover();
    const scale = Math.min(coarse ? 0.35 : 0.5, (coarse ? 384 : 768) / Math.max(width, height));
    const nextWidth = Math.max(2, Math.round(width * scale)), nextHeight = Math.max(2, Math.round(height * scale));
    if (nextWidth === simWidth && nextHeight === simHeight && fields.length) return;
    simWidth = nextWidth; simHeight = nextHeight;
    releaseFields();
    [velocity, velocityNext, density, densityNext, pressure, pressureNext, divergence] = Array.from({ length: 7 }, field);
    clear();
  }
  let splat: Shader, advect: Shader, curl: Shader, diverge: Shader, solve: Shader, project: Shader, reveal: Shader;
  try {
    [splat, advect, curl, diverge, solve, project, reveal] = [splatFragment, advectionFragment, curlFragment, divergenceFragment, pressureFragment, projectionFragment, revealFragment].map(program);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    resize();
  } catch {
    releaseFields(); for (const shader of shaders) gl.deleteProgram(shader.program);
    return null;
  }
  function render(now: number) {
    raf = 0;
    if (disposed || gl.isContextLost() || !enabled || !visible || document.hidden || !imageReady) return;
    const delta = previousTime ? clamp((now - previousTime) / (1000 / 60), 0.25, 2) : 1;
    previousTime = now; elapsed += delta / 60;
    const injecting = mouseHeld || now - lastPulse < pulseDuration;
    progress += ((injecting ? 1 : 0) - progress) * (1 - Math.pow(touchPulse && injecting ? 0.7 : 0.92, delta));
    const texel = [1 / simWidth, 1 / simHeight];
    if (injecting) {
      const amount = [(point[0] - previousPoint[0]) * 30, (point[1] - previousPoint[1]) * 30];
      const settings = { point, aspect: width / height, radius: (touchPulse ? 0.18 : 0.12) * pointerStrength };
      draw(splat, velocityNext, { ...settings, source: velocity.texture, amount });
      [velocity, velocityNext] = [velocityNext, velocity];
      draw(splat, densityNext, { ...settings, source: density.texture, amount: [delta * (touchPulse ? 2.6 : 1), 0] });
      [density, densityNext] = [densityNext, density];
    }
    previousPoint = [...point];
    draw(advect, velocityNext, { flow: velocity.texture, source: velocity.texture, texel, delta, decay: Math.pow(0.99, delta) });
    [velocity, velocityNext] = [velocityNext, velocity];
    draw(curl, velocityNext, { flow: velocity.texture, texel });
    [velocity, velocityNext] = [velocityNext, velocity];
    draw(diverge, divergence, { flow: velocity.texture, texel });
    for (let i = 0; i < (coarse ? 12 : 25); i++) {
      draw(solve, pressureNext, { pressure: pressure.texture, divergence: divergence.texture, texel });
      [pressure, pressureNext] = [pressureNext, pressure];
    }
    draw(project, velocityNext, { flow: velocity.texture, pressure: pressure.texture, texel });
    [velocity, velocityNext] = [velocityNext, velocity];
    draw(advect, densityNext, { flow: velocity.texture, source: density.texture, texel, delta, decay: Math.pow(0.01, delta / (60 * 2.4)) });
    [density, densityNext] = [densityNext, density];
    draw(reveal, null, { density: density.texture, clock: elapsed, progress });
    // Keep the completed aperture on the canvas while the cursor rests. The
    // photograph below can still change, without running a stationary GPU loop.
    if (mouseHeld && now - lastPulse >= 240) { previousTime = 0; return; }
    if (injecting || progress > 0.001) raf = requestAnimationFrame(render);
    else clear();
  }
  function schedule() {
    if (!raf && enabled && visible && !disposed && !gl.isContextLost() && !document.hidden && imageReady) raf = requestAnimationFrame(render);
  }
  function pulse(x: number, y: number, strength = 1, input: "mouse" | "touch" = "mouse") {
    if (!enabled || !visible || disposed || gl.isContextLost() || document.hidden) return;
    const nextPoint = [clamp(x / width, 0, 1), clamp(1 - y / height, 0, 1)];
    if (mouseHeld && input === "mouse" && Math.hypot((nextPoint[0] - point[0]) * width, (nextPoint[1] - point[1]) * height) < .5) return;
    if (freshPoint || performance.now() - lastPulse > 250) previousPoint = [...nextPoint];
    freshPoint = false; touchPulse = input === "touch"; mouseHeld = !touchPulse; pulseDuration = touchPulse ? 420 : 100;
    // Touch/scroll events are brief. Do not spend the entire contact ramping up an invisible mask.
    if (touchPulse) progress = Math.max(progress, 0.85);
    point = nextPoint; pointerStrength = clamp(strength, 0.8, 1.2); lastPulse = performance.now(); schedule();
  }
  const visibility = () => { if (document.hidden) clear(); };
  document.addEventListener("visibilitychange", visibility);

  function ready(image: HTMLImageElement) {
    if (disposed || gl.isContextLost() || !image.naturalWidth) return;
    imageReady = true;
    if (mouseHeld) lastPulse = performance.now();
    if (mouseHeld || progress > .001 || performance.now() - lastPulse < 2400) schedule();
  }
  return {
    setImage(src) {
      const current = ++requestId;
      const image = cache.get(src) || new Image(); image.decoding = "async";
      if (image.complete && image.naturalWidth) { ready(image); return; }
      // Keep the existing paper aperture while the next background decodes.
      imageReady = false; cancelAnimationFrame(raf); raf = 0; previousTime = 0;
      image.onload = () => { if (!disposed && current === requestId) ready(image); };
      image.onerror = () => { if (current === requestId) { imageReady = false; clear(); } };
      cache.set(src, image); image.src = src;
    },
    setEnabled(value) { if (value === enabled) return; enabled = value; clear(); },
    setVisible(value) { visible = value; if (!value) clear(); },
    pulse, resize,
    release() {
      freshPoint = true; previousPoint = [...point];
      if (mouseHeld) {
        mouseHeld = false; lastPulse = -Infinity; previousTime = 0;
        if (!imageReady) clear(); else schedule();
      }
    },
    destroy() {
      disposed = true; requestId++; clear();
      document.removeEventListener("visibilitychange", visibility);
      for (const image of cache.values()) { image.onload = null; image.onerror = null; }
      cache.clear(); releaseFields();
      for (const shader of shaders) gl.deleteProgram(shader.program);
    },
  };
}

type RevealMark = { x: number; y: number; radius: number; born: number; seed: number; fullSize?: boolean };

/** A CPU mask keeps touch feedback available on devices without float WebGL targets. */
function createCanvasLiquid(host: HTMLElement, canvas: HTMLCanvasElement): LiquidController | null {
  const context = canvas.getContext("2d", { alpha: true });
  const mask = document.createElement("canvas"), maskContext = mask.getContext("2d", { alpha: true });
  if (!context || !maskContext) return null;
  const ctx = context, maskCtx = maskContext;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cache = new Map<string, HTMLImageElement>();
  let width = 1, height = 1, dpr = 1, raf = 0, requestId = 0;
  let enabled = true, visible = true, disposed = false;
  let photograph: HTMLImageElement | null = null;
  let marks: RevealMark[] = [];
  let heldMark: RevealMark | null = null;

  function cover() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    if (enabled) { ctx.fillStyle = paperColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  function clear() {
    cancelAnimationFrame(raf); raf = 0; marks = []; heldMark = null;
    cover();
    maskCtx.setTransform(1, 0, 0, 1, 0, 0);
    maskCtx.clearRect(0, 0, mask.width, mask.height);
  }
  function resize() {
    if (disposed) return;
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5, 1920 / Math.max(width, height));
    const nextWidth = Math.max(1, Math.round(width * dpr)), nextHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width === nextWidth && canvas.height === nextHeight) return;
    canvas.width = mask.width = nextWidth; canvas.height = mask.height = nextHeight;
    cover();
    schedule();
  }
  function render(now: number) {
    raf = 0;
    if (disposed || !enabled || !visible || document.hidden || !photograph) return;
    marks = marks.filter(mark => mark === heldMark || now - mark.born < 1300);
    cover();
    maskCtx.setTransform(1, 0, 0, 1, 0, 0); maskCtx.clearRect(0, 0, mask.width, mask.height);
    if (!marks.length) return;
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const mark of marks) {
      const age = mark === heldMark ? Math.min(200, Math.max(0, now - mark.born)) : Math.max(0, now - mark.born);
      const life = mark === heldMark ? 0 : age / 1300;
      const growth = mark.fullSize ? 1 : 0.86 + Math.min(age / 200, 1) * 0.14;
      const radius = mark.radius * growth * (1 - life * 0.22);
      maskCtx.globalAlpha = Math.pow(1 - life, 0.65);
      maskCtx.fillStyle = "#fff"; maskCtx.beginPath();
      // Overlapping irregular polygons form a crisp organic reveal, never warping the photograph.
      for (let i = 0; i <= 42; i++) {
        const angle = i / 42 * Math.PI * 2;
        const edge = 1 + Math.sin(angle * 7 + mark.seed + age * 0.001) * 0.17
          + Math.cos(angle * 13 - mark.seed) * 0.1 + Math.sin(angle * 19 + mark.seed * 2) * 0.04;
        const x = mark.x + Math.cos(angle) * radius * edge, y = mark.y + Math.sin(angle) * radius * edge;
        if (i === 0) maskCtx.moveTo(x, y); else maskCtx.lineTo(x, y);
      }
      maskCtx.closePath(); maskCtx.fill();
    }
    maskCtx.globalAlpha = 1;
    ctx.globalCompositeOperation = "destination-out"; ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    // Let old trail marks fade, then leave just the stationary aperture painted.
    if (marks.some(mark => mark !== heldMark) || (heldMark && now - heldMark.born < 200)) raf = requestAnimationFrame(render);
  }
  function schedule() {
    if (!raf && !disposed && enabled && visible && !document.hidden && photograph && marks.length) raf = requestAnimationFrame(render);
  }
  const visibility = () => { if (document.hidden) clear(); };
  document.addEventListener("visibilitychange", visibility);
  resize();
  cover();
  return {
    setImage(src) {
      const current = ++requestId;
      const image = cache.get(src) || new Image(); image.decoding = "async";
      const ready = () => { if (!disposed && current === requestId) { photograph = image; schedule(); } };
      if (image.complete && image.naturalWidth) { ready(); return; }
      photograph = null; cancelAnimationFrame(raf); raf = 0;
      image.onload = ready;
      image.onerror = () => { if (!disposed && current === requestId) { photograph = null; clear(); } };
      cache.set(src, image); image.src = src;
    },
    setEnabled(value) { if (value === enabled) return; enabled = value; clear(); },
    setVisible(value) { visible = value; if (!value) clear(); },
    pulse(x, y, strength = 1, input = "mouse") {
      if (disposed || !enabled || !visible || document.hidden) return;
      const now = performance.now(), previous = marks[marks.length - 1];
      if (input === "mouse" && heldMark && Math.hypot(x - heldMark.x, y - heldMark.y) < .5) return;
      if (previous && now - previous.born < 45 && Math.hypot(x - previous.x, y - previous.y) < 12) {
        if (input === "touch" && !heldMark) return;
        if (input === "mouse" && heldMark) { heldMark.x = clamp(x, 0, width); heldMark.y = clamp(y, 0, height); schedule(); return; }
      }
      const mark = {
        x: clamp(x, 0, width), y: clamp(y, 0, height), born: now,
        radius: Math.min(width, height) * (input === "touch" ? 0.2 : 0.145) * clamp(strength, 0.8, 1.2),
        seed: Math.random() * Math.PI * 2,
      };
      heldMark = input === "mouse" ? mark : null;
      marks.push(mark);
      if (marks.length > 22) marks.splice(0, marks.length - 22);
      schedule();
    },
    release() {
      if (heldMark) {
        heldMark.born = performance.now(); heldMark.fullSize = true; heldMark = null;
        schedule();
      }
    },
    resize,
    destroy() {
      disposed = true; requestId++; clear();
      document.removeEventListener("visibilitychange", visibility);
      for (const image of cache.values()) { image.onload = null; image.onerror = null; }
      cache.clear(); photograph = null;
    },
  };
}

export function createLiquidTrail(host: HTMLElement, canvas: HTMLCanvasElement): LiquidController | null {
  // The safety cover also applies if both drawing APIs are unavailable.
  canvas.style.backgroundColor = paperColor;
  let renderer = createWebGLLiquid(host, canvas);
  let fallbackCanvas: HTMLCanvasElement | null = null;
  let disposed = false, enabled = true, visible = true, source = "";
  let lastContact: { x: number; y: number; strength: number; input: "mouse" | "touch"; at: number } | null = null;
  const originalDisplay = canvas.style.display;

  function activateFallback() {
    // A canvas cannot switch from a WebGL context to a 2D context, even after a GPU failure.
    const substitute = canvas.cloneNode(false) as HTMLCanvasElement;
    substitute.removeAttribute("id"); substitute.setAttribute("aria-hidden", "true");
    substitute.style.display = originalDisplay;
    canvas.insertAdjacentElement("afterend", substitute);
    const fallback = createCanvasLiquid(host, substitute);
    if (!fallback) { substitute.remove(); return; }
    renderer?.destroy(); renderer = fallback; fallbackCanvas = substitute;
    substitute.style.backgroundColor = "transparent";
    canvas.style.display = "none";
    restoreState();
  }
  function restoreState() {
    renderer?.setEnabled(enabled); renderer?.setVisible(visible);
    if (source) renderer?.setImage(source);
    replayContact();
  }
  function replayContact() {
    if (lastContact && (lastContact.input === "mouse" || performance.now() - lastContact.at < 500)) {
      renderer?.pulse(lastContact.x, lastContact.y, lastContact.strength, lastContact.input);
    }
  }
  function lost(event: Event) {
    event.preventDefault();
    canvas.style.backgroundColor = paperColor;
    if (!disposed && !fallbackCanvas) activateFallback();
  }
  function restored() {
    if (disposed) return;
    const recovered = createWebGLLiquid(host, canvas);
    if (!recovered) return;
    renderer?.destroy(); renderer = recovered;
    fallbackCanvas?.remove(); fallbackCanvas = null; canvas.style.display = originalDisplay;
    canvas.style.backgroundColor = "transparent";
    restoreState();
  }
  if (!renderer) activateFallback();
  if (!renderer) return null;
  if (!fallbackCanvas) canvas.style.backgroundColor = "transparent";
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  const visibility = () => { if (document.hidden) lastContact = null; };
  document.addEventListener("visibilitychange", visibility);
  return {
    setImage(src) { source = src; renderer?.setImage(src); replayContact(); },
    setEnabled(value) { if (value === enabled) return; enabled = value; if (!value) lastContact = null; renderer?.setEnabled(value); },
    setVisible(value) { if (value === visible) return; visible = value; if (!value) lastContact = null; renderer?.setVisible(value); },
    pulse(x, y, strength = 1, input = "mouse") {
      if (disposed || !enabled || !visible || document.hidden) return;
      lastContact = { x, y, strength, input, at: performance.now() };
      renderer?.pulse(x, y, strength, input);
    },
    release() { lastContact = null; renderer?.release(); },
    resize() {
      try { renderer?.resize(); replayContact(); }
      catch {
        // A larger viewport can exceed the GPU's framebuffer budget after setup.
        // Retain a working reveal instead of failing the scroll/resize listener.
        if (!disposed && !fallbackCanvas) activateFallback();
      }
    },
    destroy() {
      canvas.style.backgroundColor = paperColor;
      disposed = true; renderer?.destroy(); renderer = null;
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", visibility);
      fallbackCanvas?.remove(); fallbackCanvas = null; canvas.style.display = originalDisplay;
    },
  };
}
