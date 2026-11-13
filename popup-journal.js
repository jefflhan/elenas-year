import * as THREE from "three";
const { mountPopupJournal } = (() => {
  const { PATTERN_DEFS, CUT_FILTER, flowerSVG, LEAF, ink } = (() => {
    const INK = "#2A2622";
    const PAPER = "#FFFFFF";
    const MIS = 'transform="translate(1.8 1.3)"';
    function rng(seed) {
      let s = seed >>> 0;
      return () => {
        s = s * 1664525 + 1013904223 >>> 0;
        return s / 4294967296;
      };
    }
    const f1 = (v) => (Math.round(v * 10) / 10).toString();
    function smoothClosed(pts) {
      const n = pts.length;
      let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
        d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
      }
      return d + "Z";
    }
    const rot = (pts, a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
    };
    function roundPetal(a, len, w, r) {
      const j = () => 1 + (r() - 0.5) * 0.14;
      return rot([
        [len * 0.06, 0],
        [len * 0.32, w * 0.78 * j()],
        [len * 0.72, w * j()],
        [len, w * 0.42 * j()],
        [len * 1.04, 0],
        [len, -w * 0.42 * j()],
        [len * 0.72, -w * j()],
        [len * 0.32, -w * 0.78 * j()]
      ], a);
    }
    function pointPetal(a, len, w, r) {
      const j = () => 1 + (r() - 0.5) * 0.12;
      return rot([[len * 0.05, 0], [len * 0.35, w * j()], [len * 0.75, w * 0.55 * j()], [len, 0], [len * 0.75, -w * 0.55 * j()], [len * 0.35, -w * j()]], a);
    }
    const ink2 = (d, w = 2.2, extra = "") => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    const fill = (d, c, extra = "") => `<path d="${d}" fill="${c}" ${extra}/>`;
    const PATTERN_DEFS2 = `
<pattern id="dRed" width="4.2" height="4.2" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><circle cx="2.1" cy="2.1" r="1.05" fill="#B83A1F"/></pattern>
<pattern id="dBlue" width="4.2" height="4.2" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><circle cx="2.1" cy="2.1" r="1.1" fill="#3C5DB0"/></pattern>
<pattern id="dPeach" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><circle cx="2" cy="2" r=".9" fill="#D9825A"/></pattern>
<pattern id="dYellow" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><circle cx="2" cy="2" r=".9" fill="#D9A22E"/></pattern>
<pattern id="dLav" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="1.8" cy="1.8" r=".85" fill="#9C87C9"/></pattern>
<pattern id="dInk" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="2.5" cy="2.5" r="1" fill="${INK}"/></pattern>
<pattern id="hPink" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="5" stroke="#D98AA7" stroke-width="1.3"/></pattern>
<pattern id="hInk" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="7" stroke="${INK}" stroke-width="1.1" opacity=".5"/></pattern>`;
    const HEADS = {
      anemone(r) {
        let c = "", k = "";
        for (let i = 0; i < 5; i++) {
          const p = smoothClosed(roundPetal(-Math.PI / 2 + i * 2 * Math.PI / 5 + (r() - 0.5) * 0.15, 36, 15.5, r));
          c += fill(p, "#E0522F") + fill(p, "url(#dRed)", 'opacity=".55"');
          k += ink2(p);
        }
        let eye = `<circle r="8.5" fill="${INK}"/>`;
        for (let i = 0; i < 9; i++) {
          const a = i * 2 * Math.PI / 9;
          eye += `<circle cx="${f1(Math.cos(a) * 13)}" cy="${f1(Math.sin(a) * 13)}" r="1.6" fill="${INK}"/>`;
        }
        return `<g ${MIS}>${c}</g>${k}${eye}`;
      },
      poppy(r) {
        let c = "", k = "";
        for (let i = 0; i < 6; i++) {
          const p = smoothClosed(roundPetal(i * Math.PI / 3 + 0.3, 35, 17, r));
          c += fill(p, "#5B7FD1") + fill(p, "url(#dBlue)", 'opacity=".6"');
          k += ink2(p);
        }
        return `<g ${MIS}>${c}</g>${k}<circle r="12" fill="${INK}"/><circle r="7.5" fill="${PAPER}"/><circle r="3.6" fill="${INK}"/>`;
      },
      rose(r) {
        const ring = [];
        for (let i = 0; i < 14; i++) {
          const a = i / 14 * 2 * Math.PI, rr = 31 + (r() - 0.5) * 5;
          ring.push([Math.cos(a) * rr, Math.sin(a) * rr]);
        }
        const blob = smoothClosed(ring);
        let sp = "M0 0";
        for (let a = 0; a < 6.2 * Math.PI; a += 0.22) {
          const rr = 1.35 * a;
          sp += ` L${f1(Math.cos(a) * rr)} ${f1(Math.sin(a) * rr)}`;
        }
        return `<g ${MIS}>${fill(blob, "#F2C14E")}${fill(blob, "url(#dYellow)", 'opacity=".35"')}</g>${ink2(blob)}${ink2(sp, 2)}`;
      },
      tulip() {
        const cup = "M-24 -6 C-26 14 -14 30 0 30 C14 30 26 14 24 -6 L16 -24 L8 -8 L0 -30 L-8 -8 L-16 -24 Z";
        return `<g ${MIS}>${fill(cup, "#F3B6C4")}${fill(cup, "url(#hPink)", 'opacity=".9"')}</g>${ink2(cup)}${ink2("M-9 -8 C-6 8 -3 18 0 29 M9 -8 C6 8 3 18 0 29", 1.6)}`;
      },
      star(r) {
        let c = "", k = "", v = "";
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4 + 0.2;
          const p = smoothClosed(pointPetal(a, 36, 8.5, r));
          c += fill(p, "#F6A97F") + fill(p, "url(#dPeach)", 'opacity=".5"');
          k += ink2(p, 2);
          v += ink2(`M${f1(Math.cos(a) * 9)} ${f1(Math.sin(a) * 9)} L${f1(Math.cos(a) * 26)} ${f1(Math.sin(a) * 26)}`, 1.2);
        }
        return `<g ${MIS}>${c}</g>${k}${v}<circle r="7" fill="${INK}"/>`;
      },
      daisy(r) {
        let k = "", c = "";
        for (let i = 0; i < 15; i++) {
          const p = smoothClosed(pointPetal(i * 2 * Math.PI / 15, 34, 5.5, r));
          c += fill(p, PAPER);
          k += ink2(p, 1.7);
        }
        return `${c}${k}<circle r="9" fill="#F2C14E" ${MIS}/><circle r="9" fill="none" stroke="${INK}" stroke-width="2"/>`;
      },
      allium(r) {
        let dots = "";
        for (let i = 0; i < 46; i++) {
          const a = r() * 2 * Math.PI, rr = Math.sqrt(r()) * 25;
          dots += `<circle cx="${f1(Math.cos(a) * rr)}" cy="${f1(Math.sin(a) * rr)}" r="${f1(1.6 + r() * 1.6)}" fill="${r() < 0.78 ? "#E7A1C0" : "#F0386B"}"/>`;
        }
        return `<circle r="30" fill="#FBE6EE"/><g ${MIS}>${dots}</g><circle r="30" fill="none" stroke="${INK}" stroke-width="1.8" stroke-dasharray="1.5 4.2" stroke-linecap="round"/>`;
      },
      bells() {
        const bell = (x, y, s, rr) => {
          const d = "M-9 -10 C-10 0 -12 8 -14 12 C-9 9 -5 13 0 10 C5 13 9 9 14 12 C12 8 10 0 9 -10 C5 -14 -5 -14 -9 -10 Z";
          return `<g transform="translate(${x} ${y}) rotate(${rr}) scale(${s})"><g ${MIS}>${fill(d, "#C9B8E6")}${fill(d, "url(#dLav)", 'opacity=".6"')}</g>${ink2(d, 2 / s)}</g>`;
        };
        return ink2("M0 26 C2 6 10 -14 24 -26", 2) + bell(-2, 8, 1.15, 8) + bell(11, -11, 1, -10) + bell(23, -27, 0.85, -25);
      },
      wheat() {
        let s = ink2("M0 34 L0 -38", 2);
        for (let i = 0; i < 7; i++) {
          const y = 22 - i * 9.5, sc = 1 - i * 0.06;
          for (const side of [-1, 1]) {
            const d = `M0 ${y} c${side * 4 * sc} ${-3 * sc} ${side * 9 * sc} ${-9 * sc} ${side * 8 * sc} ${-14 * sc} c${side * -5 * sc} ${2 * sc} ${side * -8 * sc} ${7 * sc} ${side * -8 * sc} ${14 * sc}Z`;
            s += `<path d="${d}" fill="#B9C98A" ${MIS}/>` + ink2(d, 1.6);
          }
        }
        for (let i = 0; i < 5; i++) s += ink2(`M${-4 + i * 2} -40 L${-12 + i * 6} -56`, 1);
        return s;
      },
      sunflower(r) {
        let c = "", k = "";
        for (let i = 0; i < 16; i++) {
          const p = smoothClosed(pointPetal(i * 2 * Math.PI / 16 + (r() - 0.5) * 0.08, 37, 6.5, r));
          c += fill(p, "#F2C14E") + fill(p, "url(#dYellow)", 'opacity=".4"');
          k += ink2(p, 1.7);
        }
        let disc = `<circle r="15" fill="#8A5A2B" ${MIS}/><circle r="15" fill="none" stroke="${INK}" stroke-width="2"/>`;
        for (let i = 0; i < 26; i++) {
          const a = i * 2.4, rr = Math.sqrt(i / 26) * 12;
          disc += `<circle cx="${f1(Math.cos(a) * rr)}" cy="${f1(Math.sin(a) * rr)}" r="1.3" fill="${INK}"/>`;
        }
        return `<g ${MIS}>${c}</g>${k}${disc}`;
      },
      rings(r) {
        let s = ink2("M0 40 C-4 10 4 -20 0 -50", 1.8);
        for (let i = 0; i < 7; i++) {
          const y = 30 - i * 12, side = i % 2 ? 1 : -1;
          s += `<circle cx="${side * 9}" cy="${y}" r="${7 - i * 0.4}" fill="#E4EADF" stroke="${INK}" stroke-width="1.6"/>`;
          if (r() > 0.5) s += `<circle cx="${side * 9}" cy="${y}" r="${7 - i * 0.4}" fill="url(#hInk)"/>`;
        }
        return s;
      }
    };
    HEADS.sprig = (r) => {
      let s = ink2("M0 44 C-6 14 6 -18 -2 -52", 1.8);
      for (let i = 0; i < 6; i++) {
        const y = 34 - i * 15, side = i % 2 ? 1 : -1, a = side > 0 ? -28 - r() * 14 : 208 + r() * 14;
        s += `<g transform="translate(${f1(side * 2)} ${y}) rotate(${f1(a)}) scale(${f1(0.62 - i * 0.04)})">${LEAF2(i % 3 ? "#8DB596" : "#B9C98A")}</g>`;
      }
      return s;
    };
    const flowerSVG2 = (name, seed = 7) => (HEADS[name] ?? HEADS.daisy)(rng(seed));
    const LEAF2 = (color = "#8DB596") => `<path d="M0 0 C6 -8 18 -10 30 -4 C20 4 8 6 0 0 Z" fill="${color}" transform="translate(1.5 1.2)"/>${ink2("M0 0 C6 -8 18 -10 30 -4 C20 4 8 6 0 0 Z", 1.6)}${ink2("M2 -0.5 C10 -3 18 -4 26 -4", 1)}`;
    const CUT_FILTER2 = (id = "cut", r = 5) => `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="${r}" result="d"/><feFlood flood-color="${PAPER}"/><feComposite in2="d" operator="in" result="m"/><feMerge><feMergeNode in="m"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    return { PATTERN_DEFS: PATTERN_DEFS2, CUT_FILTER: CUT_FILTER2, flowerSVG: flowerSVG2, LEAF: LEAF2, ink: ink2 };
  })();
  const PX = 256, W = 5, D = 4.3;
  const TOK = { paper: "#F5F5F7", table: "#E8E8EA", cloth: "#2f5530", ink: "#23261f", ink2: "#5f6357", thread: "#2F54EB" };
  const springStep = (t, f, z) => {
    if (t <= 0) return 0;
    const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t));
  };
  const ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  async function svgTexture(svg, w, h, post) {
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    await img.decode();
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    post?.(c.getContext("2d"));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  function canvasTexture(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  function paper(ctx, w, h, base) {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    let s = 99;
    const r = () => (s = s * 1664525 + 1013904223 >>> 0) / 4294967296;
    for (let i = 0; i < w * h / 90; i++) {
      ctx.fillStyle = `rgba(60,50,40,${0.02 + r() * 0.035})`;
      ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1);
    }
  }
  function layerSVG(wu, hu, items) {
    const w = wu * PX, h = hu * PX, bx = w / 2, by = h - 4;
    let stems = "", heads = "", leaves = "";
    items.forEach((it, k) => {
      const i = it._i ?? k;
      const x = bx + it.x * PX, y = it.y * PX, mx = (bx + x) / 2 + (i % 2 ? 40 : -40), my = (by + y) / 2;
      stems += ink(`M${bx} ${by} Q${mx} ${my} ${x} ${y}`, 7);
      if (it.leaf) {
        const u = 0.45, lx = (1 - u) ** 2 * bx + 2 * (1 - u) * u * mx + u * u * x, ly = (1 - u) ** 2 * by + 2 * (1 - u) * u * my + u * u * y;
        const a = Math.atan2(2 * (1 - u) * (my - by) + 2 * u * (y - my), 2 * (1 - u) * (mx - bx) + 2 * u * (x - mx)) * 180 / Math.PI + (it.leaf > 0 ? 40 : 220);
        leaves += `<g transform="translate(${lx} ${ly}) rotate(${a}) scale(${3.2 * (it.leaf > 0 ? 1 : -1)} 3.2)">${LEAF(i % 2 ? "#8DB596" : "#B9C98A")}</g>`;
      }
      heads += `<g transform="translate(${x} ${y}) rotate(${it.rot ?? 0}) scale(${it.s})">${flowerSVG(it.head, it.seed ?? 11 + i * 37)}</g>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${PATTERN_DEFS}${CUT_FILTER("cut", 7)}</defs><g filter="url(#cut)">${stems}${leaves}${heads}</g></svg>`;
  }
  function drawTags(ctx, wu, items) {
    const bx = wu * PX / 2;
    for (const it of items) {
      if (!it.tag) continue;
      const hx = bx + it.x * PX, hy = it.y * PX, [dx, dy] = it.tag.at, tx = hx + dx, ty = hy + dy;
      ctx.strokeStyle = TOK.ink;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx + dx * 0.35, hy + dy * 0.35);
      ctx.quadraticCurveTo(hx + dx * 0.7, hy + dy * 0.45 + 18, tx, ty);
      ctx.stroke();
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate((it.tag.rot ?? 0) * Math.PI / 180);
      const w = 178, h = 62, x = dx < 0 ? -w : 0, y = -h / 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 10);
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(dx < 0 ? x + w - 16 : x + 16, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = it.tag.color;
      ctx.beginPath();
      ctx.arc(dx < 0 ? x + 22 : x + 40, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = TOK.ink;
      ctx.font = "500 32px Geist";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(it.tag.t, dx < 0 ? x + 40 : x + 58, 2);
      ctx.restore();
    }
  }
  const LAYERS = [
    { d: 0.42, w: 4.4, h: 3.85, items: [
      { head: "sprig", x: -1.75, y: 1.2, s: 3.2, rot: -34, seed: 3 },
      { head: "sprig", x: 1.7, y: 1.3, s: 3.1, rot: 30, seed: 4 },
      { head: "wheat", x: -1.05, y: 0.75, s: 3.4, rot: -14 },
      { head: "rings", x: 1.25, y: 1, s: 3.3, rot: 16 },
      { head: "bells", x: 0.62, y: 0.55, s: 3.2, rot: 6, tag: { t: "Sep 30", color: "#C9B8E6", at: [120, 150], rot: 4 } },
      { head: "rings", x: -1.55, y: 1.55, s: 3, rot: -26, seed: 5 },
      { head: "sprig", x: -0.45, y: 0.6, s: 2.8, rot: -8, seed: 6 },
      { head: "wheat", x: 0.05, y: 0.45, s: 3, rot: 4, seed: 9, tag: { t: "Aug 2", color: "#8DB596", at: [-200, 40], rot: -5 } }
    ] },
    { d: 1.05, w: 4, h: 3.25, items: [
      { head: "poppy", x: 0.02, y: 0.9, s: 3.1, leaf: 1 },
      { head: "anemone", x: -0.95, y: 1.25, s: 2.75, rot: -10, leaf: -1, tag: { t: "Oct 14", color: "#E0522F", at: [-70, -150], rot: -4 } },
      { head: "rose", x: 0.95, y: 1.18, s: 2.75, leaf: 1 },
      { head: "allium", x: 0.5, y: 0.55, s: 2.4, leaf: 1 },
      { head: "sprig", x: 1.45, y: 1.5, s: 2.4, rot: 22, seed: 8 }
    ] },
    { d: 1.7, w: 3.5, h: 2.4, items: [{ head: "tulip", x: -0.7, y: 0.75, s: 2.5, rot: -8, leaf: -1 }, { head: "daisy", x: 0.72, y: 0.7, s: 2.45, leaf: 1 }, { head: "star", x: 0.02, y: 1.02, s: 2.3, leaf: -1 }] }
  ];
  function wrapSVG() {
    const w = 2.3 * PX, h = 1.6 * PX;
    const cone = `M${w * 0.06} ${h * 0.1} C${w * 0.3} ${h * 0.22} ${w * 0.7} ${h * 0.22} ${w * 0.94} ${h * 0.06} L${w * 0.53} ${h - 6} L${w * 0.47} ${h - 6} Z`;
    const bow = `<g transform="translate(${w / 2} ${h * 0.32}) scale(3.4)" fill="none" stroke="${TOK.thread}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0 C-14 -14 -30 -10 -26 0 C-22 9 -8 4 0 0 C8 4 22 9 26 0 C30 -10 14 -14 0 0"/><path d="M-1 1 C-6 14 -12 26 -16 38 M1 1 C6 14 13 26 19 37"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${PATTERN_DEFS}${CUT_FILTER("cut", 7)}</defs><g filter="url(#cut)"><path d="${cone}" fill="#ece7da"/><path d="${cone}" fill="url(#hInk)" opacity=".5"/>${ink(cone, 7)}${ink(`M${w * 0.5} ${h - 10} L${w * 0.36} ${h * 0.18}`, 4, 'opacity=".6"')}${bow}</g></svg>`;
  }
  async function mountPopupJournal2(container, opts = {}) {
    const reduced = opts.reducedMotion ?? matchMedia("(prefers-reduced-motion: reduce)").matches;
    const entry = opts.entry ?? { date: "Tue, Oct 14", lines: ["café after pilates.", "a little girl asked about my", "bracelet, so i taught her the knot.", "matcha went cold. worth it."], label: "fall, so far", issue: "Nº 07 · October" };
    await Promise.all(["400 40px Caveat", "500 20px Geist", "400 40px Fraunces"].map((f) => document.fonts.load(f)));
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opts.capture });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    const GLOW = opts.glow ?? 0.74, SUN = opts.sun ?? 1.05;
    const sun = new THREE.DirectionalLight(16774116, SUN);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -5e-4;
    sun.shadow.normalBias = 0.02;
    Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
    sun.position.set(-3.8, 7, 7.6);
    sun.target.position.set(0, 1.2, 1.4);
    scene.add(sun, sun.target);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.08 }));
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.07;
    table.receiveShadow = true;
    scene.add(table);
    const paperMat = (map) => new THREE.MeshLambertMaterial({ map, emissiveMap: map, emissive: 16777215, emissiveIntensity: GLOW });
    const cloth = new THREE.MeshLambertMaterial({ color: TOK.cloth, emissive: TOK.cloth, emissiveIntensity: GLOW * 0.9 });
    const floorTex = canvasTexture(W * PX, D * PX, (ctx, w, h) => {
      paper(ctx, w, h, "#FCFCFB");
      ctx.strokeStyle = "rgba(35,38,31,.12)";
      ctx.lineWidth = 2;
      for (let y = 694; y < h - 40; y += 84) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(w - 80, y);
        ctx.stroke();
      }
      ctx.fillStyle = TOK.ink2;
      ctx.font = "500 32px Geist";
      ctx.fillText(entry.date, 150, 672);
      ctx.fillStyle = TOK.ink;
      ctx.font = "400 66px Caveat";
      entry.lines.forEach((l, i) => ctx.fillText(l, 150, 760 + i * 84));
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), paperMat(floorTex));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, D / 2);
    floor.receiveShadow = true;
    scene.add(floor);
    const floorCover = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, 0.06, D + 0.12), cloth);
    floorCover.position.set(0, -0.032, D / 2);
    floorCover.castShadow = floorCover.receiveShadow = true;
    scene.add(floorCover);
    const backTex = canvasTexture(W * PX, D * PX, (ctx, w, h) => {
      paper(ctx, w, h, "#FAFAF9");
      ctx.fillStyle = TOK.ink2;
      ctx.font = "500 34px Geist";
      ctx.fillText(entry.issue, 90, 120);
    });
    const back = new THREE.Group();
    scene.add(back);
    const backPage = new THREE.Mesh(new THREE.PlaneGeometry(W, D).translate(0, D / 2, 0), paperMat(backTex));
    backPage.receiveShadow = backPage.castShadow = true;
    back.add(backPage);
    const backCover = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, D + 0.12, 0.06).translate(0, D / 2, -0.034), cloth);
    backCover.castShadow = backCover.receiveShadow = true;
    back.add(backCover);
    const label = canvasTexture(900, 300, (ctx, w, h) => {
      paper(ctx, w, h, "#F1F1EE");
      ctx.fillStyle = TOK.ink;
      ctx.font = "400 120px Fraunces";
      ctx.textAlign = "center";
      ctx.fillText(entry.label, w / 2, 190);
    });
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.8), paperMat(label));
    labelMesh.rotation.set(0, Math.PI, Math.PI);
    labelMesh.position.set(0, D * 0.55, -0.066);
    back.add(labelMesh);
    const layers = [], loose = [];
    const idle = () => opts.idle?.();
    const addLayer = async (svg, wu, hu, d, i, items, arrange) => {
      await idle();
      const tex = await svgTexture(svg, wu * PX, hu * PX, items && ((ctx) => drawTags(ctx, wu, items)));
      const mat = new THREE.MeshLambertMaterial({ map: tex, emissiveMap: tex, emissive: 16777215, emissiveIntensity: GLOW, alphaTest: 0.5, side: THREE.DoubleSide, transparent: !!arrange });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wu, hu).translate(0, hu / 2, 0), mat);
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
      const g = new THREE.Group();
      g.position.set(0, 4e-3 * (i + 1), d + (arrange ? 0.012 * (arrange.order + 1) : 0));
      g.add(mesh);
      scene.add(g);
      layers.push({ g, mesh, i });
      if (arrange) loose.push({ mesh, ...arrange });
    };
    let order = 0;
    for (const [i, L] of LAYERS.entries()) {
      if (i === 0) {
        await addLayer(layerSVG(L.w, L.h, L.items), L.w, L.h, L.d, i, L.items);
        continue;
      }
      for (const [k, it] of L.items.entries()) {
        const one = [{ ...it, _i: k }];
        const start = clamp(2 * Math.atan2(it.x, L.h - it.y), -0.9, 0.9);
        await addLayer(layerSVG(L.w, L.h, one), L.w, L.h, L.d, i, one, { order: order++, side: it.x < 0 ? -1 : 1, start, hero: !!it.tag });
      }
    }
    await addLayer(wrapSVG(), 2.3, 1.6, 2.3, 3);
    const OPEN_AT = opts.openAt ?? 0.35;
    const AUTO_AT = OPEN_AT + (opts.arrangeAfter ?? 1.6), STAGGER = 0.14;
    let ARRANGE_AT = opts.cue ? Infinity : AUTO_AT, SWITCH_AT = Infinity, HERO_AT = Infinity, SETTLED = 0;
    const FLY = 0.9, FLY_STAGGER = 0.07, SETTLE = 0.3;
    const HERO = { from: [2.6, 1.3], ctl: [1.4, 2.4], hover: 0.42, fly: 0.95, hold: 0.2, drop: 0.2, pulse: 0.4 };
    let pointer = { x: 0, y: 0 }, look = { x: 0, y: 0, vx: 0, vy: 0 };
    function pose(t) {
      const open = reduced ? 1 : springStep(t - OPEN_AT, 0.8, 0.62);
      const cam = reduced ? 1 : ease(clamp((t - OPEN_AT + 0.25) / 2.6));
      return { theta: open * THREE.MathUtils.degToRad(92), cam, t };
    }
    function apply({ theta, cam, t }) {
      const phi = Math.PI / 2 - theta;
      back.rotation.x = phi;
      back.position.y = 0.02;
      layers.forEach(({ g }) => {
        g.rotation.x = phi;
      });
      for (const f of loose) {
        if (f.hero) {
          const v2 = reduced ? 9 : t - HERO_AT, m = f.mesh, H = HERO;
          m.visible = v2 > 0;
          m.material.opacity = clamp(v2 / 0.12);
          let x = 0, y = 0;
          if (v2 < H.fly) {
            const q = ease(clamp(v2 / H.fly)), a = 1 - q;
            x = a * a * H.from[0] + 2 * a * q * H.ctl[0];
            y = a * a * H.from[1] + 2 * a * q * H.ctl[1] + q * q * H.hover;
          } else if (v2 < H.fly + H.hold) y = H.hover;
          else {
            const d = clamp((v2 - H.fly - H.hold) / H.drop);
            y = H.hover * (1 - d * d);
          }
          const p = clamp((v2 - H.fly - H.hold - H.drop) / H.pulse);
          m.position.set(x, y, 0);
          m.rotation.z = (1 - clamp(v2 / H.fly)) * -0.18;
          m.scale.setScalar(1 + 0.08 * Math.sin(Math.PI * p));
          continue;
        }
        const u = reduced ? 9 : t - (ARRANGE_AT + f.order * STAGGER), k = springStep(u, 1.15, 0.72);
        f.mesh.visible = u > 0;
        f.mesh.material.opacity = clamp(u / 0.12);
        const v = reduced ? 9 : t - (SWITCH_AT + f.order * FLY_STAGGER), turn = ease(clamp(v / (FLY * 0.75))), land = clamp((v - FLY) / SETTLE);
        const lift = 0.32 * ease(clamp(v / (FLY * 0.4))) * (1 - clamp((v - FLY * 0.8) / (FLY * 0.2)) ** 2);
        f.mesh.position.y = (1 - k) * 0.85 + lift;
        f.mesh.rotation.z = (1 - k) * f.side * 0.22 + f.start * (1 - turn);
        f.mesh.scale.setScalar(1 + 0.05 * Math.sin(Math.PI * land));
      }
      const w = renderer.domElement.clientWidth || 1, h = renderer.domElement.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const fit = camera.aspect < 0.95 ? 1.25 : 1;
      const sx = opts.shiftX ?? 0;
      camera.position.set(lerp(0.4, 0, cam) + look.x * 1.6 + sx, lerp(7.6, 3.1, cam) + look.y * 0.8, lerp(15.5, 14.2, cam) * fit * (opts.zoom ?? 1));
      camera.lookAt(sx, lerp(0.2, 1.7, cam), lerp(2.2, 1.35, cam));
      renderer.render(scene, camera);
    }
    function resize() {
      const r = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    }
    resize();
    let t0 = performance.now(), raf = 0, visible = true, mode = "live", last = 0;
    const now = () => (performance.now() - t0) / 1e3;
    const retime = () => {
      SWITCH_AT = ARRANGE_AT + loose.length * STAGGER + 0.45;
      HERO_AT = SWITCH_AT + loose.length * FLY_STAGGER + FLY * 0.6;
      SETTLED = reduced ? 0 : Math.max(OPEN_AT + 3.85, HERO_AT + HERO.fly + HERO.hold + HERO.drop + HERO.pulse + 0.1);
    };
    retime();
    const yieldFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
    await idle();
    try {
      await renderer.compileAsync(scene, camera);
    } catch {
      renderer.compile(scene, camera);
    }
    for (const tx of [floorTex, backTex, label, ...layers.map(({ mesh }) => mesh.material.map)]) {
      await idle();
      renderer.initTexture(tx);
      await yieldFrame();
    }
    await idle();
    renderer.render(scene, camera);
    await yieldFrame();
    t0 = performance.now() - 1e3 * Math.max(0, (typeof opts.startAt === "function" ? opts.startAt() : opts.startAt) ?? 0);
    apply(pose(reduced ? 99 : now()));
    function frame(ts) {
      raf = 0;
      if (mode !== "live" || !visible) return;
      const dt = Math.min(0.05, last ? (ts - last) / 1e3 : 1 / 60);
      last = ts;
      const k = 60, c = 2 * Math.sqrt(k);
      look.vx += (k * (pointer.x - look.x) - c * look.vx) * dt;
      look.x += look.vx * dt;
      look.vy += (k * (pointer.y - look.y) - c * look.vy) * dt;
      look.y += look.vy * dt;
      const t = now();
      apply(pose(t));
      const chasing = Math.abs(pointer.x - look.x) + Math.abs(pointer.y - look.y) + Math.abs(look.vx) + Math.abs(look.vy) > 5e-4;
      if (t < SETTLED || chasing) raf = requestAnimationFrame(frame);
      else last = 0;
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e) => {
      if (reduced) return;
      const r = container.getBoundingClientRect();
      pointer = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * -1 };
      kick();
    };
    const onLeave = () => {
      pointer = { x: 0, y: 0 };
      kick();
    };
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(container);
    const ro = new ResizeObserver(() => {
      resize();
      apply(pose(mode === "live" ? now() : 99));
    });
    ro.observe(container);
    kick();
    opts.onReady?.();
    return {
      seek(t) {
        mode = "seek";
        if (ARRANGE_AT === Infinity) {
          ARRANGE_AT = AUTO_AT;
          retime();
        }
        apply(pose(t));
      },
      replay() {
        mode = "live";
        t0 = performance.now();
        if (opts.cue) {
          ARRANGE_AT = Infinity;
          retime();
        }
        kick();
      },
      arrange() {
        if (ARRANGE_AT !== Infinity) return;
        ARRANGE_AT = Math.max(now(), OPEN_AT + 1);
        retime();
        kick();
      },
      dispose() {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        scene.traverse((o) => {
          o.geometry?.dispose();
          const ms = [].concat(o.material ?? [], o.customDepthMaterial ?? []);
          ms.forEach((m) => {
            m.map?.dispose();
            m.emissiveMap?.dispose();
            m.dispose();
          });
        });
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }
  return { mountPopupJournal: mountPopupJournal2 };
})();
export {
  mountPopupJournal
};
