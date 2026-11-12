// «Знак»: точки в трёхмерном пространстве собираются в фигуры.
// Фигуры: loop – петля рутины, report – столбики отчёта, contract – лист договора, post – сообщение,
// summary – круговая сводка, chain – цепь из пяти агентов, mark – восклицательный знак из названия.
// window.Sign.create(canvas, { count, start, frame(W, H, sign), host, interactive, labels, sway })
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  // точка на периметре квадрата со стороной 2w, u – доля обхода
  const sq = (u, w) => {
    const s = (u % 1) * 4, k = s | 0, f = s - k;
    return k === 0 ? [-w + 2 * w * f, -w] : k === 1 ? [w, -w + 2 * w * f] : k === 2 ? [w - 2 * w * f, w] : [-w, w - 2 * w * f];
  };
  const put = (p, i, x, y, z) => { p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = z; };

  // Точки идут по порядку вдоль контура: соседние по номеру лежат рядом, поэтому между ними можно вести тонкую линию.
  const gen = {
    loop(N, p) {
      const c = (a) => { const d = 1 + Math.sin(a) ** 2; return [(1.14 * Math.cos(a)) / d, (1.5 * Math.sin(a) * Math.cos(a)) / d]; };
      for (let i = 0; i < N; i++) {
        const u = i / N, a = u * TAU, b = u * TAU * 64, r = 0.115;
        const [x, y] = c(a), [x2, y2] = c(a + 0.002);
        let tx = x2 - x, ty = y2 - y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
        put(p, i, x - ty * r * Math.cos(b), y + tx * r * Math.cos(b), r * Math.sin(b) + 0.17 * Math.sin(a));
      }
    },
    report(N, p) {
      const hs = [0.55, 0.85, 0.7, 1.15, 1.5], m = Math.ceil(N / 5);
      for (let i = 0; i < N; i++) {
        const k = Math.min(4, (i / m) | 0), u = (i - k * m) / m, h = hs[k];
        const [x, z] = sq(u * (10 + h * 14), 0.13);
        put(p, i, (k - 2) * 0.4 + x, -0.75 + h * Math.min(1, u / 0.9), z);
      }
    },
    contract(N, p) {
      const w = 0.62, h = 0.86, rows = [0.92, 0.8, 0.92, 0.62, 0.9, 0.84, 0.5];
      for (let i = 0; i < N; i++) {
        const u = i / N; let x, y;
        if (u < 0.22) { const q = sq(u / 0.22, 1); x = q[0] * w; y = q[1] * h; }
        else if (u < 0.8) { const v = ((u - 0.22) / 0.58) * rows.length, r = Math.min(rows.length - 1, v | 0); x = -0.46 + (v - r) * rows[r]; y = 0.62 - r * 0.14; }
        else if (u < 0.9) { const f = (u - 0.8) / 0.1; x = 0.02 + f * 0.44; y = -0.58 + 0.06 * Math.sin(f * TAU * 3.5) + 0.03 * Math.sin(f * TAU * 9); }
        else { const f = (u - 0.9) / 0.1, a = f * TAU * 2, r = f < 0.5 ? 0.13 : 0.09; x = -0.3 + r * Math.cos(a); y = -0.56 + r * Math.sin(a); }
        put(p, i, x, y, i % 2 ? 0.03 : -0.03);
      }
    },
    post(N, p) {
      const len = [1.12, 1.12, 0.7];
      for (let i = 0; i < N; i++) {
        const u = i / N; let x, y, z = 0;
        if (u < 0.5) {
          const a = (u / 0.5) * TAU * 2, c = Math.cos(a), s = Math.sin(a);
          x = 0.9 * Math.sign(c) * Math.sqrt(Math.abs(c)); y = 0.18 + 0.55 * Math.sign(s) * Math.sqrt(Math.abs(s)); z = u < 0.25 ? -0.08 : 0.08;
        } else if (u < 0.62) {
          const f = (u - 0.5) / 0.12;
          if (f < 0.5) { const q = f / 0.5; x = -0.5 - 0.18 * q; y = -0.36 - 0.46 * q; } else { const q = (f - 0.5) / 0.5; x = -0.68 + 0.52 * q; y = -0.82 + 0.45 * q; }
        } else { const v = ((u - 0.62) / 0.38) * 3, r = Math.min(2, v | 0); x = -0.56 + (v - r) * len[r]; y = 0.42 - r * 0.22; }
        put(p, i, x, y, z);
      }
    },
    summary(N, p) {
      const wedge = 1.1, bx = Math.cos(wedge / 2) * 0.17, by = Math.sin(wedge / 2) * 0.17;
      for (let i = 0; i < N; i++) {
        const u = i / N, out = u >= 0.8;
        const a = out ? ((u - 0.8) / 0.2) * wedge : wedge + (u / 0.8) * (TAU - wedge);
        const r = 0.42 + 0.5 * (0.5 + 0.5 * Math.sin(u * TAU * 110));
        put(p, i, Math.cos(a) * r + (out ? bx : 0), Math.sin(a) * r + (out ? by : 0), i % 2 ? 0.07 : -0.07);
      }
    },
    mark(N, p) {
      const nb = Math.floor(N * 0.74), m = N - nb;
      for (let i = 0; i < N; i++) {
        if (i < nb) {
          const u = i / nb, y = -0.4 + 1.4 * u, [x, z] = sq(u * 30, 0.1 + (y + 0.4) * 0.085);
          put(p, i, x + y * 0.12, y, z);
        } else {
          const j = i - nb, yy = 1 - (j / (m - 1)) * 2, r = Math.sqrt(1 - yy * yy), a = j * 2.39996, y = -0.8 + yy * 0.2;
          put(p, i, Math.cos(a) * r * 0.2 + y * 0.12, y, Math.sin(a) * r * 0.2);
        }
      }
    },
    chain(N, p, g) {
      const m = Math.ceil(N / 5);
      for (let i = 0; i < N; i++) {
        const k = Math.min(4, (i / m) | 0), u = (i - k * m) / m, a = u * TAU, t = u * TAU * 34;
        const rr = 0.3 + Math.cos(t) * 0.05, c = rr * Math.cos(a), d = rr * Math.sin(a), e = Math.sin(t) * 0.05, cx = (k - 2) * 0.43;
        if (k % 2 === 0) put(p, i, cx + c, d, e); else put(p, i, cx + c, e, d);
        g[i] = k;
      }
    },
  };

  const create = (cv, o = {}) => {
    const ctx = cv.getContext('2d');
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = o.count || 2400;
    const sway = o.sway == null ? 0.5 : o.sway;
    const cache = {};
    const shape = (name) => {
      if (!cache[name]) { const p = new Float32Array(N * 3), g = name === 'chain' ? new Uint8Array(N) : null; gen[name](N, p, g); cache[name] = { p, g }; }
      return cache[name];
    };
    const from = new Float32Array(N * 3), pos = new Float32Array(N * 3);
    const delay = new Float32Array(N), offx = new Float32Array(N), offy = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
    const sxA = new Float32Array(N), syA = new Float32Array(N);
    let W = 0, H = 0, cur = o.start || 'loop', to = shape(cur), t0 = -1, dur = 1.9, raf = 0, seen = true;
    let px = -9999, py = -9999, mx = 0.5, my = 0.5, emx = 0.5, emy = 0.5, userYaw = 0, userVel = 0, drag = null;
    let fx = null, fy = 0, fS = 1, active = -1;
    for (let i = 0; i < N; i++) delay[i] = Math.random() * 0.6;
    if (calm) from.set(to.p);
    else for (let i = 0; i < N; i++) { // на старте точки разбросаны: фигура собирается из хаоса
      const a = rnd(0, TAU), b = Math.acos(rnd(-1, 1)), r = rnd(2.6, 7);
      put(from, i, Math.sin(b) * Math.cos(a) * r, Math.sin(b) * Math.sin(a) * r, Math.cos(b) * r * 0.5);
    }
    pos.set(from);

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fx = null;
    };

    const draw = (now) => {
      const t = now / 1000;
      if (t0 < 0) t0 = calm ? t - 10 : t;
      const k = t - t0;
      const f = o.frame ? o.frame(W, H, api) : { ox: W / 2, oy: H / 2, S: Math.min(W, H) * 0.3 };
      if (fx === null || calm) { fx = f.ox; fy = f.oy; fS = f.S; } else { fx += (f.ox - fx) * 0.07; fy += (f.oy - fy) * 0.07; fS += (f.S - fS) * 0.07; }
      emx += (mx - emx) * 0.06; emy += (my - emy) * 0.06;
      if (!drag) { userYaw += userVel; userVel *= 0.95; }
      const yaw = (calm ? 0.35 : Math.sin(t * 0.4) * sway) + userYaw + (emx - 0.5) * 0.5, pitch = -0.16 + (emy - 0.5) * 0.45;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const settle = clamp((k - dur - 0.45) / 0.6);
      const grouped = to.g && active >= 0;
      const far = new Path2D(), mid = new Path2D(), near = new Path2D(), glow = new Path2D();
      const line = settle > 0 ? new Path2D() : null;
      const maxL = (fS * 0.17) ** 2, R = Math.max(90, fS * 0.45), R2 = R * R, base = W < 700 ? 0.9 : 1.05;
      let lx = 0, ly = 0;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        const e = ease(clamp((k - delay[i]) / dur)), j = i * 3;
        const x = (pos[j] = from[j] + (to.p[j] - from[j]) * e);
        const y = (pos[j + 1] = from[j + 1] + (to.p[j + 1] - from[j + 1]) * e);
        const z = (pos[j + 2] = from[j + 2] + (to.p[j + 2] - from[j + 2]) * e);
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const f2 = 2.8 / (2.8 + z2);
        let sx = fx + x1 * fS * f2, sY = fy - y1 * fS * f2;
        if (o.interactive) { // точки расступаются от курсора и возвращаются на место
          const dx = sx - px, dy = sY - py, d2 = dx * dx + dy * dy; let tx = 0, ty = 0;
          if (d2 < R2) { const d = Math.sqrt(d2) || 1, q = 1 - d / R, push = q * q * R * 0.6; tx = (dx / d) * push; ty = (dy / d) * push; }
          vx[i] = (vx[i] + (tx - offx[i]) * 0.1) * 0.8; vy[i] = (vy[i] + (ty - offy[i]) * 0.1) * 0.8;
          offx[i] += vx[i]; offy[i] += vy[i];
          sx += offx[i]; sY += offy[i];
        }
        sxA[i] = sx; syA[i] = sY;
        let lvl; // 0 – дальние и неактивные, 1 – средние, 2 – ближние и активные
        if (grouped) lvl = active >= 6 || to.g[i] === active - 1 ? 2 : to.g[i] < active - 1 ? 1 : 0;
        else lvl = z2 < -0.18 || i % 9 === 0 ? 2 : z2 < 0.25 ? 1 : 0;
        const r = base * f2 * (lvl === 2 ? 1.7 : lvl === 1 ? 1.25 : 1);
        (lvl === 2 ? near : lvl === 1 ? mid : far).rect(sx - r, sY - r, r * 2, r * 2);
        if (lvl === 2) glow.rect(sx - r * 3, sY - r * 3, r * 6, r * 6);
        if (line) { if (i && (sx - lx) ** 2 + (sY - ly) ** 2 < maxL) line.lineTo(sx, sY); else line.moveTo(sx, sY); lx = sx; ly = sY; }
      }
      if (line) { ctx.strokeStyle = `rgba(243,239,232,${(0.13 * settle).toFixed(3)})`; ctx.lineWidth = 0.7; ctx.stroke(line); }
      ctx.fillStyle = 'rgba(243,239,232,.24)'; ctx.fill(far);
      ctx.fillStyle = 'rgba(255,150,96,.8)'; ctx.fill(mid);
      ctx.fillStyle = 'rgba(255,106,44,.1)'; ctx.fill(glow);
      ctx.fillStyle = '#FF6A2C'; ctx.fill(near);
      if (o.labels && cur === 'chain' && settle > 0) { // подписи под звеньями цепи
        ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        o.labels.forEach((text, n) => {
          const x = (n - 2) * 0.43, x1 = x * cy, z1 = -x * sy, y1 = -0.5 * cp - z1 * sp, z2 = -0.5 * sp + z1 * cp, f2 = 2.8 / (2.8 + z2);
          if (n !== active - 1) return; // подписано только звено текущего агента: пять подписей в ряд сливаются
          ctx.fillStyle = `rgba(243,239,232,${settle})`;
          ctx.fillText(text, fx + x1 * fS * f2, fy - y1 * fS * f2 + 6);
        });
      }
    };
    const loop = (now) => { draw(now); raf = requestAnimationFrame(loop); };
    const start = () => { if (!raf && !calm && seen && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const once = () => { if (calm) draw(performance.now()); };

    const api = {
      big: false,
      get shape() { return cur; },
      morph(name) {
        if (name === cur || !gen[name]) return;
        cur = name; to = shape(name);
        if (calm) { from.set(to.p); pos.set(to.p); return once(); }
        from.set(pos); t0 = performance.now() / 1000; dur = 1.15;
      },
      setActive(n) { active = n; once(); },
      burst(x, y) { // щелчок разбрасывает точки, потом они собираются обратно
        for (let i = 0; i < N; i++) {
          const dx = sxA[i] - x, dy = syA[i] - y, d = Math.hypot(dx, dy) || 1, imp = Math.min(40, 2800 / (d + 30));
          vx[i] += (dx / d) * imp; vy[i] += (dy / d) * imp;
        }
      },
      destroy() { stop(); },
    };

    size();
    draw(performance.now());
    addEventListener('resize', () => { size(); if (calm || !raf) draw(performance.now()); });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { seen = en[0].isIntersecting; seen ? start() : stop(); }).observe(cv);
    else start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    if (o.interactive && o.host) {
      const host = o.host;
      const rel = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      host.addEventListener('pointermove', (e) => {
        [px, py] = rel(e); mx = px / W; my = py / H;
        if (drag) { const dx = e.clientX - drag.x; userYaw += dx * 0.007; userVel = dx * 0.007; drag.x = e.clientX; drag.moved += Math.abs(dx); }
      });
      host.addEventListener('pointerdown', (e) => { if (!e.target.closest('a,button,input,label')) drag = { x: e.clientX, x0: e.clientX, y0: e.clientY, moved: 0 }; });
      host.addEventListener('pointerup', (e) => {
        if (!drag) return;
        const still = drag.moved < 6 && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6;
        drag = null;
        if (still) { const [x, y] = rel(e); api.burst(x, y); }
      });
      host.addEventListener('pointercancel', () => { drag = null; });
      host.addEventListener('pointerleave', () => { px = -9999; py = -9999; drag = null; });
    }
    return api;
  };

  window.Sign = { create };
})();
