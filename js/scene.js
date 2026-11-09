/* Inner Work — what sits behind the app.
   Three zen garden paintings (assets/bg) are the built-in backgrounds; Settings picks one, or a new
   one each day. Two other choices: a forest drawn here to fit the screen (trees, waterfall, stream,
   rocks, Buddha, lantern), or a photo of your own, kept in this browser under "innerwork.bg". */
(function () {
  const host = document.getElementById("scene");
  if (!host) return;
  let lastW = 0, lastH = 0;
  const BG = {                     // file, and the part of the picture to keep in view on a narrow screen
    zen1: ["assets/bg/zen-waterfall.webp", "62% 50%"],
    zen2: ["assets/bg/zen-garden.webp", "66% 50%"],
    zen3: ["assets/bg/zen-falls.webp", "72% 42%"]
  };
  const read = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  let choice = read("innerwork.bgchoice") || "zen1";
  window.IWScene = {
    names: Object.keys(BG),
    set(c) { choice = c || "zen1"; try { localStorage.setItem("innerwork.bgchoice", choice); } catch (e) { /* not remembered */ } apply(); },
    refresh() { apply(); }
  };
  function apply() {
    let c = choice, own = null;
    if (c === "daily") c = IWScene.names[Math.floor(Date.now() / 864e5) % IWScene.names.length];
    if (c === "photo") { own = read("innerwork.bg"); if (!own) c = "zen1"; }
    if (c === "drawn") { host.style.backgroundImage = ""; build(); return; }
    host.innerHTML = ""; lastW = innerWidth; lastH = innerHeight;
    host.style.backgroundImage = `url("${own || BG[c][0]}")`; host.style.backgroundPosition = own ? "center" : BG[c][1];
    document.documentElement.style.setProperty("--hero", "34vh");
  }

  function build() {
    const vw = innerWidth, vh = innerHeight; lastW = vw; lastH = vh;
    const H = 1000, W = Math.max(420, Math.round(vw / vh * H));
    const side = (vw - 700) / 2 * (H / vh);          // free space either side of the content column
    const wide = side >= 300;
    const g = wide ? 650 : 385;                      // where the ground begins
    const s = wide ? 1.05 : Math.max(0.56, Math.min(0.9, W / 1100));
    const bx = wide ? side * 0.5 : W * 0.23, fx = wide ? W - side * 0.5 : W * 0.78, cx = W * 0.5;
    document.documentElement.style.setProperty("--hero", (wide ? 0 : Math.round(g / H * 100 * 0.7)) + "vh");

    let seed = 11;
    const R = () => (seed = seed * 16807 % 2147483647) / 2147483647, r = (a, b) => a + R() * (b - a), f = n => n.toFixed(1);
    const fir = (x, y, h, w) => {
      const n = 5; let l = "", rr = "";
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, hw = w / 2 * (1 - t0 * 0.82), y0 = y - h * (0.12 + 0.88 * t0), y1 = y - h * (0.12 + 0.88 * t1);
        l += `L${f(x - hw)},${f(y0)} L${f(x - hw * 0.42)},${f(y1)} `;
        rr = `L${f(x + hw * 0.42)},${f(y1)} L${f(x + hw)},${f(y0)} ` + rr;
      }
      return `M${f(x - w * 0.05)},${f(y)} L${f(x - w * 0.05)},${f(y - h * 0.12)} ${l}L${f(x)},${f(y - h)} ${rr}L${f(x + w * 0.05)},${f(y - h * 0.12)} L${f(x + w * 0.05)},${f(y)}Z`;
    };
    const ridge = (y, amp, fr, ph) => x => y + Math.sin(x / W * fr + ph) * amp;
    const land = (base, fill) => { let d = `M0,${H} L0,${f(base(0))}`; for (let x = 0; x <= W + 40; x += 40) d += ` L${x},${f(base(x))}`; return `<path d="${d} L${W},${H}Z" fill="${fill}"/>`; };
    const forest = (base, n, h0, h1, fill, skip) => {
      let d = "";
      for (let i = 0; i < n; i++) { const x = -40 + (W + 80) * (i + R() * 0.8) / n, h = r(h0, h1) * s; if (skip && skip(x)) continue; d += fir(x, base(x) + 4, h, h * r(0.42, 0.56)); }
      return `<path d="${d}" fill="${fill}"/>`;
    };
    const canopy = (base, n, r0, r1, cols, skip) => {
      let o = "";
      for (let i = 0; i < n; i++) { const x = r(-30, W + 30), rad = r(r0, r1) * s; if (skip && skip(x)) continue; o += `<circle cx="${f(x)}" cy="${f(base(x) - rad * r(0.3, 1.1))}" r="${f(rad)}" fill="${cols[i % cols.length]}"/>`; }
      return o;
    };
    const rock = (x, y, rx, ry) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#rock)"/><ellipse cx="${f(x - rx * 0.12)}" cy="${f(y - ry * 0.55)}" rx="${f(rx * 0.72)}" ry="${f(ry * 0.42)}" fill="#4c8a5f" opacity=".85"/>`;
    const leaf = (x, y, len, ang, fill) => `<ellipse cx="${f(len / 2)}" cy="0" rx="${f(len / 2)}" ry="${f(len * 0.1)}" transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})" fill="${fill}"/>`;
    const fan = (x, y, a0, a1, n, len) => { let o = ""; for (let i = 0; i < n; i++) o += leaf(x, y, r(len * 0.6, len), a0 + (a1 - a0) * i / (n - 1) + r(-4, 4), i % 2 ? "#174229" : "#0f2e1f"); return o; };

    const nearFall = x => Math.abs(x - fx) < 175 * s, nearBuddha = x => Math.abs(x - bx) < 95 * s;
    const b1 = ridge(g - 235 * s, 14, 9, 1), b2 = ridge(g - 170 * s, 18, 7, 2.2), b3 = ridge(g - 95 * s, 16, 6, 0.6), b4 = ridge(g, 9, 5, 3);
    const T = g - 288 * s, L = g - 30 * s, Pl = g + 34 * s;         // waterfall top, ledge, pool
    const a = Pl + 0.35 * (H - Pl), b = Pl + 0.62 * (H - Pl);
    const mid = t => [fx + (cx - fx) * Math.pow(t, 1.25), Pl + (H - Pl) * t];
    const P = [];

    P.push(`<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3d6"/><stop offset=".4" stop-color="#d3e8cc"/><stop offset="1" stop-color="#a5cdb1"/></linearGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="#fff9d2" stop-opacity=".95"/><stop offset="1" stop-color="#fff9d2" stop-opacity="0"/></radialGradient>
      <radialGradient id="halo"><stop offset="0" stop-color="#fff1b5" stop-opacity=".6"/><stop offset="1" stop-color="#fff1b5" stop-opacity="0"/></radialGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#73847b"/><stop offset="1" stop-color="#36443d"/></linearGradient>
      <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bcc7bf"/><stop offset="1" stop-color="#66746d"/></linearGradient>
      <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d3efeb"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2eee9"/><stop offset=".45" stop-color="#84c2b8"/><stop offset="1" stop-color="#3f8f88"/></linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#357751"/><stop offset="1" stop-color="#12331f"/></linearGradient>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0" stop-opacity=".22"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/></linearGradient>
      <filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="${f(10 * s)}"/></filter>
    </defs>`);

    // sky, light, far ridges
    P.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="${f(W * 0.6)}" cy="${f(g * 0.2)}" r="${f(430 * s)}" fill="url(#glow)"/>`);
    P.push(land(ridge(g - 300 * s, 30, 5, 0.4), "#c2dcc6"));
    P.push(land(b1, "#b0d0b8") + forest(b1, Math.round(W / 24), 45, 82, "#a2c6ab"));
    P.push(land(b2, "#8ebb9a") + forest(b2, Math.round(W / 32), 72, 125, "#7fb08d"));
    P.push(`<rect y="${f(g - 275 * s)}" width="${W}" height="${f(170 * s)}" fill="url(#mist)"/>`);

    // cliff and waterfall
    const c = (dx, dy) => `${f(fx + dx * s)},${f(g + dy * s)}`;
    P.push(`<path d="M${c(-190, 40)} L${c(-172, -150)} L${c(-120, -255)} L${c(-40, -300)} L${c(60, -290)} L${c(140, -240)} L${c(185, -130)} L${c(200, 40)}Z" fill="url(#rock)"/>
      <path d="M${c(-172, -150)} L${c(-120, -255)} L${c(-92, -120)} L${c(-150, 40)} L${c(-190, 40)}Z" fill="#000" opacity=".13"/>
      <path d="M${c(60, -290)} L${c(140, -240)} L${c(185, -130)} L${c(118, -90)} L${c(84, -200)}Z" fill="#fff" opacity=".07"/>`);
    P.push(`<path d="${fir(fx - 150 * s, g - 188 * s, 96 * s, 46 * s)}${fir(fx - 96 * s, g - 262 * s, 84 * s, 40 * s)}${fir(fx + 112 * s, g - 258 * s, 112 * s, 52 * s)}${fir(fx + 166 * s, g - 168 * s, 90 * s, 42 * s)}" fill="#3f7a56"/>`);
    [[-128, -250, 30], [-78, -284, 34], [-150, -196, 24], [88, -282, 34], [136, -244, 28], [172, -170, 24], [36, -300, 22]].forEach(m => P.push(`<circle cx="${f(fx + m[0] * s)}" cy="${f(g + m[1] * s)}" r="${f(m[2] * s)}" fill="${m[2] % 4 ? "#4f8a63" : "#3f7a56"}"/>`));
    P.push(`<path d="M${f(fx - 20 * s)},${f(T)} C${f(fx - 24 * s)},${f((T + L) / 2)} ${f(fx - 27 * s)},${f(L - 40 * s)} ${f(fx - 30 * s)},${f(L)} L${f(fx + 30 * s)},${f(L)} C${f(fx + 27 * s)},${f(L - 40 * s)} ${f(fx + 24 * s)},${f((T + L) / 2)} ${f(fx + 20 * s)},${f(T)}Z" fill="url(#fall)"/>
      <path d="M${f(fx - 34 * s)},${f(L)} L${f(fx - 46 * s)},${f(Pl)} L${f(fx + 46 * s)},${f(Pl)} L${f(fx + 34 * s)},${f(L)}Z" fill="url(#fall)" opacity=".92"/>`);
    for (let k = -2; k <= 2; k++) P.push(`<line class="streak" x1="${f(fx + k * 9 * s)}" y1="${f(T + 8)}" x2="${f(fx + k * 11 * s)}" y2="${f(Pl - 4)}" stroke="#fff" stroke-opacity=".7" stroke-width="${f(2.2 * s)}" stroke-dasharray="26 18" style="animation-delay:${-k * 0.3}s"/>`);
    P.push(rock(fx - 52 * s, L + 4 * s, 26 * s, 13 * s) + rock(fx + 54 * s, L + 6 * s, 24 * s, 12 * s));

    // nearer trees, the ground, the pool and the stream
    P.push(land(b3, "#5b9670") + canopy(b3, Math.round(W / 26), 28, 54, ["#5f9b72", "#4f8a63", "#6aa67b"], nearFall) + forest(b3, Math.round(W / 46), 125, 195, "#3f7a56", nearFall));
    P.push(land(b4, "url(#ground)"));
    P.push(`<ellipse cx="${f(fx)}" cy="${f(Pl + 8 * s)}" rx="${f(150 * s)}" ry="${f(30 * s)}" fill="url(#water)"/>
      <path d="M${f(fx - 70 * s)},${f(Pl + 12 * s)} C${f(fx - 160 * s)},${f(a)} ${f(cx - 100 * s)},${f(b)} ${f(cx - 150 * s)},${H} L${f(cx + 150 * s)},${H} C${f(cx + 150 * s)},${f(b)} ${f(fx + 30 * s)},${f(a)} ${f(fx + 70 * s)},${f(Pl + 12 * s)}Z" fill="url(#water)"/>`);
    [-34, 0, 38].forEach((o, i) => P.push(`<path class="flow" d="M${f(fx + o * 0.4 * s)},${f(Pl + 20 * s)} C${f(fx - 45 * s + o * s)},${f(a)} ${f(cx + 25 * s + o * s)},${f(b)} ${f(cx + o * 2 * s)},${H}" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="${f(3 * s)}" stroke-linecap="round" stroke-dasharray="38 72" style="animation-delay:${-i * 1.7}s"/>`));
    P.push(`<ellipse class="puff" cx="${f(fx)}" cy="${f(Pl)}" rx="${f(125 * s)}" ry="${f(34 * s)}" fill="#fff" opacity=".6" filter="url(#soft)"/>`);
    [0.16, 0.3, 0.47, 0.64, 0.82].forEach((t, i) => { const [mx, my] = mid(t), hw = (70 + 95 * t) * s, sgn = i % 2 ? 1 : -1, rx = r(26, 46) * s; P.push(rock(mx + sgn * (hw + rx * 0.5), my + r(-6, 10), rx, rx * r(0.5, 0.62))); });
    { const [mx, my] = mid(0.4), x = mx + (95 + 95 * 0.4) * s, y = my + 6; P.push([[26, 11, 0], [20, 9, -17], [15, 7, -31], [10, 5.5, -42], [6, 4, -50]].map(q => `<ellipse cx="${f(x)}" cy="${f(y + q[2] * s)}" rx="${f(q[0] * s)}" ry="${f(q[1] * s)}" fill="url(#stone)"/>`).join("")); }

    // the Buddha, seated on a mossy rock
    const k = s * (wide ? 1.05 : 1.12);
    P.push(`<g transform="translate(${f(bx)},${f(g + 30 * s)}) scale(${f(k)})">
      <circle cx="0" cy="-196" r="92" fill="url(#halo)"/>
      <ellipse cx="0" cy="8" rx="132" ry="27" fill="#3a4741"/><ellipse cx="-44" cy="-2" rx="66" ry="11" fill="#4c8a5f" opacity=".85"/><ellipse cx="70" cy="4" rx="40" ry="8" fill="#4c8a5f" opacity=".7"/>
      <ellipse cx="0" cy="-18" rx="104" ry="19" fill="#74827b"/><ellipse cx="0" cy="-25" rx="97" ry="15" fill="#93a099"/>
      <g fill="url(#stone)">
        <path d="M-100,-30 C-100,-66 -50,-82 0,-82 C50,-82 100,-66 100,-30 C70,-13 -70,-13 -100,-30Z"/>
        <path d="M-60,-48 C-72,-98 -62,-150 -30,-166 C-15,-172 15,-172 30,-166 C62,-150 72,-98 60,-48 C40,-38 -40,-38 -60,-48Z"/>
        <rect x="-11" y="-188" width="22" height="26" rx="6"/><ellipse cx="-28" cy="-203" rx="5" ry="14"/><ellipse cx="28" cy="-203" rx="5" ry="14"/>
        <ellipse cx="0" cy="-208" rx="27" ry="31"/><ellipse cx="0" cy="-240" rx="14" ry="11"/><circle cx="0" cy="-252" r="4.5"/>
      </g>
      <ellipse cx="0" cy="-50" rx="33" ry="10" fill="#c3cdc6"/>
      <path d="M-30,-166 C-6,-122 20,-92 56,-72" fill="none" stroke="#55635c" stroke-width="2" opacity=".55"/>
      <path d="M-15,-207 q6,4 12,0 M3,-207 q6,4 12,0 M-8,-193 q8,4 16,0" fill="none" stroke="#4f5c56" stroke-width="1.7" stroke-linecap="round"/>
      <ellipse cx="-40" cy="-148" rx="21" ry="8" fill="#4c8a5f" opacity=".7" transform="rotate(-28 -40 -148)"/><ellipse cx="46" cy="-58" rx="27" ry="8" fill="#4c8a5f" opacity=".7"/>
    </g>`);

    // a stone lantern on the bank
    if (W > 760) P.push(`<g transform="translate(${f(wide ? fx - 250 * s : fx + 190 * s)},${f(g + (wide ? 58 : 22) * s)}) scale(${f(s * 0.82)})">
      <circle class="lamp" cx="0" cy="-99" r="46" fill="url(#halo)"/>
      <g fill="url(#stone)"><rect x="-26" y="-10" width="52" height="12" rx="3"/><rect x="-9" y="-70" width="18" height="62"/><rect x="-30" y="-80" width="60" height="11" rx="3"/><rect x="-22" y="-118" width="44" height="40"/><path d="M-52,-114 Q0,-128 52,-114 L30,-142 Q0,-152 -30,-142Z"/><circle cx="0" cy="-152" r="7"/></g>
      <rect x="-10" y="-110" width="20" height="23" rx="2" fill="#ffe7a3"/></g>`);

    // light, fireflies, and leaves framing the corners
    const sx = W * 0.6;
    [[-560, -430], [-380, -300], [-220, -160]].forEach(q => P.push(`<path d="M${f(sx - 20)},-20 L${f(sx + 40)},-20 L${f(sx + q[1] * s)},${f(g + 120)} L${f(sx + q[0] * s)},${f(g + 120)}Z" fill="url(#ray)"/>`));
    for (let i = 0; i < 12; i++) P.push(`<circle class="fly" cx="${f(r(W * 0.05, W * 0.95))}" cy="${f(r(g - 120 * s, Math.min(H - 60, g + 300)))}" r="${f(r(1.6, 2.8))}" fill="#fff3b0" style="animation-delay:${f(-r(0, 9))}s"/>`);
    const fl = Math.max(150, 290 * s);
    P.push(fan(-14, H + 12, -84, -8, 7, fl) + fan(W + 14, H + 12, -96, -172, 7, fl) + fan(-12, -12, 8, 62, 5, fl * 0.8) + fan(W + 12, -12, 172, 118, 5, fl * 0.8));

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">${P.join("")}</svg>`;
  }

  apply();
  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => { if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 140) apply(); }, 200); });
})();
