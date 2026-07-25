"use client";

/* The Safetyline wave background — direct port of the site's own WebGL
   ribbon shader (assets/app.js module 9) into a React client component.
   Fixed full-viewport canvas behind the light sections; pointer-reactive
   shimmer + click ripple on fine pointers; single still frame on touch
   devices and under reduced motion (battery + a11y). */

import { useEffect, useRef } from "react";

const STILL_TIME = 5.0;

const VS = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FS = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_energy;
  uniform vec3 u_click;

  void main() {
    vec2 screenUv = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = screenUv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.y -= 0.24;
    uv.x *= aspect;

    vec3 cobalt = vec3(0.02, 0.15, 0.82);
    vec3 azure  = vec3(0.00, 0.36, 0.88);
    vec3 cyan   = vec3(0.04, 0.68, 0.90);

    float mdist = length(uv - u_mouse);
    float minfluence = exp(-mdist * mdist * 6.0) * u_energy;

    float ct = max(u_time - u_click.z, 0.0);
    float cdist = length(uv - u_click.xy);
    float ring = exp(-pow((cdist - ct * 0.6) * 9.0, 2.0)) * exp(-ct * 1.6) * step(0.001, u_click.z);

    vec3 finalColor = vec3(0.0);
    float finalAlpha = 0.0;

    for (float i = 1.0; i <= 6.0; i++) {
      float t = u_time * 0.3 + i * 0.15;
      float y = sin(uv.x * (1.5 + i * 0.2) + t) * 0.15 * cos(t * 0.5);
      y += cos(uv.x * (1.0 + i * 0.3) - t * 0.8) * 0.1;
      y += sin(12.0 * mdist - u_time * 4.0 + i * 0.6) * 0.05 * minfluence;
      y += ring * 0.045 * sin(i * 1.7);

      float d = abs(uv.y - y);
      float core = smoothstep(0.014 + i * 0.0012, 0.0, d);
      float halo = smoothstep(0.085 + i * 0.006, 0.0, d) * 0.18;

      float phase = 0.5 + 0.5 * sin(uv.x * 1.1 + t + i * 0.42);
      vec3 strand = mix(cobalt, azure, phase * 0.62);
      strand = mix(strand, cyan, smoothstep(3.0, 6.0, i) * 0.34);
      strand += vec3(0.08, 0.22, 0.28) * minfluence;

      finalColor += strand * (core * 0.92 + halo * 0.20);
      finalAlpha += core * 0.46 + halo * 0.24;
    }

    vec3 color = clamp(finalColor, 0.0, 1.0);
    float topFade = 1.0 - smoothstep(0.42, 0.54, screenUv.y);
    float alpha = clamp(finalAlpha * topFade, 0.0, 0.62);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uEnergy = gl.getUniformLocation(program, "u_energy");
    const uClick = gl.getUniformLocation(program, "u_click");

    const pointer = { x: -10, y: -10, tx: -10, ty: -10, energy: 0, target: 0 };
    const click = { x: 0, y: 0, t: -1000 };
    let shaderTime = 0;

    const toWaveSpace = (cx: number, cy: number) => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight);
      return {
        x: (cx / Math.max(1, window.innerWidth)) * aspect,
        y: 1 - cy / Math.max(1, window.innerHeight) - 0.24,
      };
    };

    const onMove = (e: PointerEvent) => {
      const p = toWaveSpace(e.clientX, e.clientY);
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.target = 1;
    };
    const onDown = (e: PointerEvent) => {
      const p = toWaveSpace(e.clientX, e.clientY);
      click.x = p.x;
      click.y = p.y;
      click.t = shaderTime;
    };
    const onLeave = () => {
      pointer.target = 0;
    };

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (w === 0 || h === 0) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      shaderTime = time;
      pointer.target *= 0.985;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.energy += (pointer.target - pointer.energy) * 0.06;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, pointer.x, pointer.y);
      gl.uniform1f(uEnergy, pointer.energy);
      gl.uniform3f(uClick, click.x, click.y, click.t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let rafId = 0;
    const cleanupFns: Array<() => void> = [];

    if (reducedMotion || !finePointer) {
      const drawStill = () => draw(STILL_TIME);
      drawStill();
      window.addEventListener("resize", drawStill);
      const onVis = () => {
        if (!document.hidden) drawStill();
      };
      document.addEventListener("visibilitychange", onVis);
      cleanupFns.push(() => {
        window.removeEventListener("resize", drawStill);
        document.removeEventListener("visibilitychange", onVis);
      });
    } else {
      const loop = (t: number) => {
        draw(t * 0.001);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
      const onVis = () => {
        cancelAnimationFrame(rafId);
        if (!document.hidden) rafId = requestAnimationFrame(loop);
      };
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanupFns.push(() => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    }

    return () => cleanupFns.forEach((f) => f());
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
