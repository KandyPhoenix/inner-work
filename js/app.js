/* Inner Work — app shell. Vanilla JS, no build step. Everything is stored in this browser.
   Therapy program, mood rescues, deeper-work tools, EMDR-style processing, the guide,
   plus Vision Board, Journal and Shadow Work (life.js, moved here from Synthesis). */
const IW = window.IW;
const KEY = "innerwork.v1", DAY = 864e5, MODEL = "claude-opus-5-5";

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = t => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const sum = a => a.reduce((x, y) => x + y, 0);
const paras = t => String(t).split(/\n{2,}/).map(p => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");

/* ---------- state ---------- */
const blank = () => ({ v: 1, profile: null, tracks: {}, sessions: {}, practice: {}, moods: [], checkins: [], rescues: [], threads: [], chats: [], safety: {}, stage: "intake", graduatedAt: null, life: null, emdr: [], calm: null, settings: { apiKey: "", bls: "both" } });
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); return Object.assign(blank(), d, { settings: Object.assign({ apiKey: "", bls: "both" }, d.settings) }); } } catch (e) { /* start fresh */ }
  return blank();
}
let S = load();
let saveTimer;
let dirty = false;
const saveNow = () => { clearTimeout(saveTimer); dirty = false; S._updatedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } if (window.IWSync) window.IWSync.changed(); };
const save = () => { dirty = true; clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 250); };
addEventListener("pagehide", () => { if (dirty) saveNow(); });

/* transient UI state, never stored */
const U = { emdr: null, intake: { step: 0, name: "", why: "", concerns: [] }, check: { phq: [], gad: [] }, mood: { v: null, note: "" }, rescue: null, draft: "", note: "", flash: "", sending: false, keepScroll: false, fromCheck: false };

const rootOf = path => path.startsWith("U.") ? [U, path.slice(2)] : [S, path];
function get(path) { const [o, p] = rootOf(path); return p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
function set(path, v) {
  const [o, p] = rootOf(path); const ks = p.split("."); let a = o;
  for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null) a[ks[i]] = {}; a = a[ks[i]]; }
  a[ks[ks.length - 1]] = v;
}

/* ---------- program helpers ---------- */
const TRACK = Object.fromEntries(IW.tracks.map(t => [t.id, t]));
const SES = {}; IW.tracks.forEach(t => t.sessions.forEach((s, i) => { SES[s.id] = { s, t, i }; }));
const isOn = id => !!TRACK[id].always || !!S.tracks[id];
const plan = () => IW.trackOrder.filter(isOn).flatMap(id => TRACK[id].sessions);
const done = id => !!(S.sessions[id] && S.sessions[id].doneAt);
const nextSession = () => plan().find(s => !done(s.id));
const lastDoneId = () => { const e = Object.entries(S.sessions).filter(([, v]) => v.doneAt).sort((a, b) => b[1].doneAt - a[1].doneAt)[0]; return e && e[0]; };
const lastCheck = () => S.checkins[S.checkins.length - 1];
function checkEvery() { if (S.stage === "graduated") return Infinity; if (S.stage === "maintenance") return Date.now() - S.graduatedAt < 60 * DAY ? 14 : 30; return 14; }
const checkDue = () => { const l = lastCheck(); return !l || Date.now() - l.t >= checkEvery() * DAY; };

function readiness() {
  const p = plan(), d = p.filter(s => done(s.id)).length, c = S.checkins, base = c[0], last = lastCheck(), last2 = c.slice(-2);
  const low = last2.length === 2 && last2.every(x => x.phq < 5 && x.gad < 5);
  const halved = c.length >= 2 && last2.every(x => x.phq < 10 && x.gad < 10) && last.phq <= base.phq / 2 && last.gad <= base.gad / 2;
  const a = (S.sessions.s2 && S.sessions.s2.answers) || {};
  const r = { done: d, total: p.length, sessionsOk: d >= Math.ceil(p.length * 0.9), scoresOk: low || halved, planOk: !!(a.signs && a.amber) };
  r.ready = r.sessionsOk && r.scoresOk && r.planOk;
  return r;
}
function stayedWell() {
  if (S.stage !== "maintenance" || !S.graduatedAt) return false;
  const since = S.checkins.filter(c => c.t >= S.graduatedAt);
  return Date.now() - S.graduatedAt >= 90 * DAY && since.length >= 3 && since.every(c => c.phq < 5 && c.gad < 5);
}

/* ---------- shared pieces ---------- */
function chips(path, opts, stack) {
  const cur = get(path) || [];
  return `<div class="chips${stack ? " stack" : ""}">${opts.map(o => { const [val, label] = Array.isArray(o) ? o : [o, o]; return `<button type="button" class="chip" data-act="chip" data-path="${path}" data-val="${esc(val)}" aria-pressed="${cur.includes(val)}">${esc(label)}</button>`; }).join("")}</div>`;
}
function scale(path, label, lo, hi, min = 0, max = 10) {
  const v = get(path);
  return `<label class="fld"><span>${esc(label)}</span><div class="scale"><input type="range" min="${min}" max="${max}" step="1" value="${v == null ? Math.round((min + max) / 2) : v}" data-bind="${path}" data-num="1" class="${v == null ? "unset" : ""}"><output>${v == null ? "–" : v}</output></div>${lo ? `<div class="ends"><span>${esc(lo)}</span><span>${esc(hi)}</span></div>` : ""}</label>`;
}
const breather = secs => `<div class="breather" data-secs="${secs}"><div class="orb"></div><div class="btxt">In for 4, out for 6</div><button type="button" class="btn ghost small" data-act="breathe">Start</button></div>`;
function field(base, f) {
  const [id, type, label, opt] = f, path = `${base}.${id}`, val = get(path);
  if (type === "ta") return `<label class="fld"><span>${esc(label)}</span><textarea data-bind="${path}" rows="3">${esc(val || "")}</textarea></label>`;
  if (type === "tx") return `<label class="fld"><span>${esc(label)}</span><input type="text" data-bind="${path}" value="${esc(val || "")}"></label>`;
  if (type === "sc") return scale(path, label, "0", "10");
  if (type === "ck") return `<div class="fld"><span>${esc(label)}</span>${chips(path, opt)}</div>`;
  if (type === "br") return `<div class="fld"><span>${esc(label)}</span>${breather(opt)}</div>`;
  return "";
}
function questions(kind) {
  return IW[kind].map((q, i) => `<fieldset class="q"><legend>${i + 1}. ${esc(q)}</legend><div class="opts">${IW.scaleOptions.map((o, v) => `<button type="button" class="opt" data-act="ans" data-kind="${kind}" data-i="${i}" data-v="${v}" aria-pressed="${U.check[kind][i] === v}">${o}</button>`).join("")}</div></fieldset>`).join("");
}
const answered = kind => IW[kind].every((_, i) => U.check[kind][i] != null);
const flash = () => { const f = U.flash; U.flash = ""; return f ? `<div class="flash" role="status">${f}</div>` : ""; };
function grow(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }

/* ---------- views ---------- */
const views = {};

views.intake = () => {
  const I = U.intake, n = I.step;
  const nav = (nextLabel = "Next") => `<div class="row between">${n > 0 ? `<button class="btn quiet" data-act="intakeBack">Back</button>` : "<span></span>"}<button class="btn" data-act="intakeNext">${nextLabel}</button></div>`;
  if (n === 0) return `
    <p class="eyebrow">Welcome</p><h1>Inner Work</h1>
    <p class="lede">A full course of therapy you work through yourself. Structured sessions, tools for the moments your mood drops, deeper work for the things that don't shift, and a guide to talk it through with.</p>
    <p>Most people take three to six months at one or two sessions a week. It ends when your check-in scores and your own judgement say you no longer need it. After that it checks in on you less and less, and then stops.</p>
    <div class="card soft"><h2>Before you start</h2><ul class="plain">
      <li>This is a self-guided program. It is not a clinician. It can't diagnose, prescribe, or keep you safe in an emergency.</li>
      <li>If you are ever thinking about ending your life, use <strong>Help now</strong> at the top of every screen.</li>
      <li>The trauma work is paced carefully and some of it is better done with a therapist. The app says where.</li>
      <li>What you write stays on this device unless you choose to sign in and save it across your devices. When you use the guide, your messages are sent to Anthropic to get a reply.</li>
    </ul></div>
    <p class="small">Already using Inner Work on another device? <a href="#/settings">Sign in</a> to bring everything across.</p>${nav("Begin")}`;
  if (n === 1) return `
    <p class="eyebrow">Step 1 of 5</p><h1>About you</h1>
    <div class="card"><label class="fld"><span>What should I call you?</span><input type="text" data-bind="U.intake.name" value="${esc(I.name)}" autocomplete="given-name"></label>
    <label class="fld"><span>What's brought you here? Say as much or as little as you like.</span><textarea data-bind="U.intake.why" rows="4">${esc(I.why)}</textarea></label></div>${nav()}`;
  if (n === 2) return `
    <p class="eyebrow">Step 2 of 5</p><h1>What do you want to work on?</h1>
    <p class="lede">Pick everything that applies. This decides which parts of the program you get. You can change it at any time.</p>
    <div class="card">${chips("U.intake.concerns", IW.concerns.map(c => [c[0], c[1]]), true)}</div>
    <p class="muted small">Everyone also gets the foundations, the work on acceptance and meaning, and the staying-well plan.</p>${nav()}`;
  if (n === 3) return `
    <p class="eyebrow">Step 3 of 5 · Low mood</p><h1>Over the last two weeks</h1>
    <p class="lede">How often have you been bothered by each of these? This is the PHQ-9, the questionnaire most clinicians use. You'll repeat it every two weeks so you can see change.</p>
    <div class="card">${questions("phq")}</div>${flash()}${nav()}`;
  if (n === 4) return `
    <p class="eyebrow">Step 4 of 5 · Anxiety</p><h1>Over the last two weeks</h1>
    <p class="lede">Same again, for anxiety. This is the GAD-7.</p>
    <div class="card">${questions("gad")}</div>${flash()}${nav()}`;
  const phq = sum(U.check.phq), gad = sum(U.check.gad), tr = intakeTracks(phq, gad);
  const count = IW.trackOrder.filter(id => TRACK[id].always || tr[id]).reduce((a, id) => a + TRACK[id].sessions.length, 0);
  return `
    <p class="eyebrow">Step 5 of 5</p><h1>Your starting point and your plan</h1>
    <div class="stats"><div class="card"><p class="eyebrow">Low mood (PHQ-9)</p><div class="big">${phq}</div><p class="muted small">${IW.band("phq", phq)} · out of 27</p></div>
    <div class="card"><p class="eyebrow">Anxiety (GAD-7)</p><div class="big">${gad}</div><p class="muted small">${IW.band("gad", gad)} · out of 21</p></div></div>
    ${phq >= 20 ? `<div class="card warn"><h3>Please also see a doctor or therapist</h3><p>Your low-mood score is in the severe range. This program works well alongside professional care, and at this level you should have both.</p></div>` : ""}
    <div class="card"><h2>${count} sessions across ${IW.trackOrder.filter(id => TRACK[id].always || tr[id]).length} areas</h2>
      <ul class="plain">${IW.trackOrder.filter(id => TRACK[id].always || tr[id]).map(id => `<li><strong>${esc(TRACK[id].name)}</strong> · ${TRACK[id].sessions.length} sessions</li>`).join("")}</ul>
      <p class="muted small">About ${Math.ceil(count / 2)} weeks at two sessions a week, or ${count} weeks at one. Take the time it takes.</p></div>${nav("Start")}`;
};
function intakeTracks(phq, gad) {
  const t = {}; IW.concerns.forEach(c => { if (U.intake.concerns.includes(c[0])) t[c[2]] = true; });
  if (phq >= 5) t.mood = true; if (gad >= 5) t.anxiety = true; return t;
}

views.today = () => {
  const h = new Date().getHours(), hello = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const nx = nextSession(), ld = lastDoneId(), r = readiness();
  const recentLow = S.moods.length && Date.now() - S.moods[S.moods.length - 1].t < 2 * 36e5 && S.moods[S.moods.length - 1].v <= 3;
  const pr = ld && SES[ld].s.practice, doneToday = ld && (S.practice[ld] || []).includes(dayKey());
  const week = ld ? (S.practice[ld] || []).filter(d => Date.now() - new Date(d).getTime() < 7 * DAY).length : 0;
  const stageNote = S.stage === "maintenance" ? `<div class="flash">You've graduated and you're in maintenance. Check-ins are every ${checkEvery()} days.</div>` : S.stage === "graduated" ? `<div class="flash">You've finished the program. Everything here stays available whenever you want it.</div>` : "";
  return `
    <div><h1>${hello}${S.profile.name ? ", " + esc(S.profile.name) : ""}</h1></div>${stageNote}${flash()}
    <div class="card">${scale("U.mood.v", "How are you right now?", "worst", "best")}
      <label class="fld"><span class="small muted" style="font-weight:500">A word about why (optional)</span><input type="text" data-bind="U.mood.note" value="${esc(U.mood.note)}"></label>
      <div class="row end"><button class="btn small" data-act="logMood">Log it</button></div></div>
    ${recentLow ? `<a class="card warn" href="#/rescue"><h3>That's a low number</h3><p>You don't have to sit in it. Try a ten-minute mood rescue.</p><span class="go">Help me feel better →</span></a>` : ""}
    ${checkDue() && S.stage !== "graduated" ? `<a class="card soft" href="#/checkin"><h3>Your check-in is due</h3><p>Two minutes. It's how you'll know whether this is working.</p><span class="go">Check in →</span></a>` : ""}
    <div class="grid two">
      <a class="card" href="#/rescue"><h3>I need to feel better now</h3><p class="muted">Short guided steps for the state you're in.</p><span class="go">Lift my mood →</span></a>
      ${nx ? `<a class="card" href="#/session/${nx.id}"><p class="eyebrow">Next session · ${esc(SES[nx.id].t.name)}</p><h3>${esc(nx.t)}</h3><span class="go">${S.sessions[nx.id] && S.sessions[nx.id].startedAt ? "Continue" : "Start"} →</span></a>`
           : `<a class="card" href="#/${S.stage === "program" ? "graduate" : "program"}"><h3>You've finished every session in your plan</h3><span class="go">${S.stage === "program" ? "See if you're ready to graduate" : "Revisit a session"} →</span></a>`}
      <a class="card" href="#/explore"><h3>Work through something that isn't shifting</h3><p class="muted">Find what's holding it in place, and why you can't seem to change it.</p><span class="go">Go deeper →</span></a>
      <a class="card" href="#/guide"><h3>Talk it through</h3><p class="muted">A conversation with your guide.</p><span class="go">Open the guide →</span></a>
    </div>
    <div class="grid three">
      <a class="card" href="#/journal"><p class="eyebrow">Journal</p><h3>${journalToday() ? "Written today" : "Today's page is blank"}</h3><p class="muted small">${lifeStats().entries} entr${lifeStats().entries === 1 ? "y" : "ies"}${lifeStats().streak ? " · " + lifeStats().streak + "-day streak" : ""}</p></a>
      <a class="card" href="#/vision"><p class="eyebrow">Vision board</p><h3>${lifeStats().visions ? lifeStats().visions + " vision" + (lifeStats().visions === 1 ? "" : "s") : "Start your board"}</h3><p class="muted small">${moonNow().emoji} ${moonNow().phase}</p></a>
      <a class="card" href="#/shadow"><p class="eyebrow">Shadow work</p><h3>${lifeStats().exercises} of ${IW.life.exercises.length} exercises</h3><p class="muted small">${lifeStats().reflections} reflection${lifeStats().reflections === 1 ? "" : "s"}</p></a>
    </div>
    ${pr ? `<div class="card"><p class="eyebrow">This week's practice · from “${esc(SES[ld].s.t)}”</p><p>${esc(pr)}</p>
      <div class="row between"><span class="muted small">${week} day${week === 1 ? "" : "s"} this week</span><button class="btn small ${doneToday ? "quiet" : "ghost"}" data-act="practised" data-id="${ld}" ${doneToday ? "disabled" : ""}>${doneToday ? "Done today ✓" : "I practised today"}</button></div></div>` : ""}
    <div class="card"><div class="row between"><span class="small muted">${r.done} of ${r.total} sessions done</span><a class="small" href="#/progress">Progress</a></div><div class="bar"><i style="width:${r.total ? (100 * r.done / r.total) : 0}%"></i></div></div>`;
};

views.program = () => `
  <div><h1>Your program</h1><p class="lede">Work down the list. The steadying skills come first, the deeper work later. You can open any session, and add or remove areas whenever you like.</p></div>${flash()}
  ${IW.trackOrder.map(id => {
    const t = TRACK[id], on = isOn(id), nx = nextSession();
    const d = t.sessions.filter(s => done(s.id)).length;
    return `<div class="card"><div class="row between"><h2>${esc(t.name)}</h2>${t.always ? `<span class="tag">Core</span>` : `<button class="btn small ${on ? "quiet" : "ghost"}" data-act="toggleTrack" data-id="${id}">${on ? "Remove" : "Add to my plan"}</button>`}</div>
      <p class="muted">${esc(t.blurb)}</p>
      ${on ? `${t.caution ? `<p class="small" style="color:var(--warn)">${esc(t.caution)}</p>` : ""}<div class="bar"><i style="width:${100 * d / t.sessions.length}%"></i></div>
      <ul class="slist">${t.sessions.map((s, i) => `<li class="${done(s.id) ? "done" : nx && nx.id === s.id ? "next" : ""}"><a href="#/session/${s.id}"><span class="st">${done(s.id) ? "✓" : i + 1}</span><span>${esc(s.t)}<small>${esc(s.m)}</small></span></a></li>`).join("")}</ul>` : ""}</div>`;
  }).join("")}`;

views.session = id => {
  const e = SES[id]; if (!e) return views.program();
  const { s, t, i } = e, base = `sessions.${id}`;
  if (!S.sessions[id]) S.sessions[id] = { answers: {} };
  if (!S.sessions[id].answers) S.sessions[id].answers = {};
  if (!S.sessions[id].startedAt) { S.sessions[id].startedAt = Date.now(); save(); }
  const st = S.sessions[id], p = plan(), pos = p.findIndex(x => x.id === id), prev = pos > 0 ? p[pos - 1] : null, nxt = pos >= 0 ? p[pos + 1] : null;
  const caution = s.caution || (i === 0 && t.caution);
  return `
    <a class="back" href="#/program">← Program</a>
    <div><p class="eyebrow">${esc(t.name)} · Session ${i + 1} of ${t.sessions.length}</p><h1>${esc(s.t)}</h1><p style="margin-top:10px"><span class="tag">${esc(s.m)}</span></p></div>
    ${caution ? `<div class="card warn"><h3>Go carefully</h3><p>${esc(caution)}</p></div>` : ""}
    <div class="card"><div class="step"><span class="n">1</span><h2>Arrive</h2></div>
      ${scale(`${base}.moodBefore`, "Your mood right now", "worst", "best")}
      ${prev && prev.practice ? `<label class="fld"><span>Last time you set out to practise this. How did it go?</span><p class="muted small">${esc(prev.practice)}</p><textarea data-bind="${base}.review" rows="2">${esc(st.review || "")}</textarea></label>` : ""}</div>
    <div class="card learn"><div class="step"><span class="n">2</span><h2>Understand</h2></div>${s.learn.map(x => `<p>${esc(x)}</p>`).join("")}</div>
    <div class="card"><div class="step"><span class="n">3</span><h2>Work it through</h2></div><p class="muted">${esc(s.intro)}</p>${s.f.map(f => field(`${base}.answers`, f)).join("")}</div>
    <div class="card soft"><div class="step"><span class="n">4</span><h2>Between now and next time</h2></div><p>${esc(s.practice)}</p></div>
    <div class="card"><div class="step"><span class="n">5</span><h2>What you're taking away</h2></div>
      <label class="fld"><span>The one thing from this session you want to remember</span><textarea data-bind="${base}.takeaway" rows="2">${esc(st.takeaway || "")}</textarea></label>
      ${scale(`${base}.helpful`, "How useful was this session?", "not at all", "very")}</div>
    <div class="row between"><button class="btn ghost" data-act="newChat" data-kind="session" data-ref="${id}">Talk this through with the guide</button>
      ${st.doneAt ? `<span class="muted small">Completed ${fmtDate(st.doneAt)}</span>` : `<button class="btn" data-act="completeSession" data-id="${id}">Mark session complete</button>`}</div>
    ${st.doneAt && nxt ? `<a class="card" href="#/session/${nxt.id}"><p class="eyebrow">Up next</p><h3>${esc(nxt.t)}</h3><p class="muted small">Give yourself a few days of practice first.</p></a>` : ""}`;
};

views.graduate = () => {
  const r = readiness(), l = lastCheck();
  const high = l && (l.phq >= 10 || l.gad >= 10);
  return `
    <a class="back" href="#/progress">← Progress</a>
    <div><h1>${r.ready ? "You're ready to graduate" : "Are you ready to graduate?"}</h1></div>
    <div class="card"><ul class="check">
      <li class="${r.sessionsOk ? "yes" : ""}">Sessions: ${r.done} of ${r.total} done</li>
      <li class="${r.scoresOk ? "yes" : ""}">Scores: your last two check-ins are both in the minimal range, or have halved since you started and are below 10</li>
      <li class="${r.planOk ? "yes" : ""}">Your early-warning plan is written (Staying well, session 2)</li></ul></div>
    ${r.ready ? `<div class="card soft"><p>You've done the work and the numbers agree. From here the app steps back: a check-in every two weeks for two months, then monthly. Three steady months and you're finished.</p><button class="btn" data-act="graduate">Move to maintenance</button></div>`
      : `<div class="card"><p>${r.sessionsOk && r.planOk && high
          ? "You've done the sessions and your scores are still in the moderate range or above. That is the point where adding a human therapist, a medical review, or both is the right next step. It's a normal part of treatment and says nothing bad about you or your effort. Keep using the tools here alongside it."
          : "Not everything is ticked yet. That's fine. Finish what's open, keep practising, and check in every two weeks."}</p>
          <div class="row"><a class="btn" href="#/program">Keep working</a><button class="btn quiet" data-act="graduate">Move to maintenance anyway</button></div></div>`}`;
};

views.rescue = id => {
  if (!id) {
    const stats = IW.rescues.map(f => { const r = S.rescues.filter(x => x.flow === f.id && x.before != null && x.after != null); return r.length ? { f, n: r.length, lift: sum(r.map(x => x.before - x.after)) / r.length } : null; }).filter(Boolean).sort((a, b) => b.lift - a.lift);
    U.rescue = null;
    return `<div><h1>What's it like right now?</h1><p class="lede">Pick the closest. Each one takes about ten minutes.</p></div>
      <div class="grid two">${IW.rescues.map(f => `<a class="card" href="#/rescue/${f.id}"><h3>${esc(f.name)}</h3><p class="muted small">${esc(f.line)}</p></a>`).join("")}</div>
      ${stats.length ? `<div class="card"><h2>What has helped you before</h2><ul class="plain">${stats.map(x => `<li>${esc(x.f.name)}: eased by ${x.lift.toFixed(1)} points on average (${x.n} time${x.n === 1 ? "" : "s"})</li>`).join("")}</ul></div>` : ""}
      <p class="muted small">If you're thinking about ending your life, go to <a href="#/crisis">Help now</a>.</p>`;
  }
  const f = IW.rescues.find(x => x.id === id); if (!f) return views.rescue();
  if (!U.rescue || U.rescue.id !== id) U.rescue = { id, i: -1, before: null, after: null, a: {} };
  const R = U.rescue, n = f.steps.length, head = `<a class="back" href="#/rescue">← All rescues</a><p class="eyebrow">${esc(f.name)}</p>`;
  if (R.i === -1) return `${head}<h1>First, a number</h1><div class="card">${scale("U.rescue.before", "How strong is the feeling right now?", "calm", "worst")}</div><div class="row end"><button class="btn" data-act="rescueNext">Start</button></div>`;
  if (R.i < n) {
    const s = f.steps[R.i], p = `U.rescue.a.s${R.i}`;
    const body = s.k === "say" ? `<p style="font-size:1.08rem">${esc(s.p)}</p>` : s.k === "breathe" ? breather(s.secs) : s.k === "pick" ? chips(p, s.opts, true) : `<textarea data-bind="${p}" rows="3" aria-label="${esc(s.h)}">${esc(get(p) || "")}</textarea>`;
    return `${head}<div class="bar"><i style="width:${100 * (R.i + 1) / (n + 1)}%"></i></div><h1>${esc(s.h)}</h1><div class="card">${body}</div>
      <div class="row between"><button class="btn quiet" data-act="rescueBack">Back</button><button class="btn" data-act="rescueNext">Next</button></div>`;
  }
  if (R.i === n) return `${head}<h1>And now?</h1><div class="card">${scale("U.rescue.after", "How strong is the feeling now?", "calm", "worst")}</div><div class="row end"><button class="btn" data-act="rescueNext">Finish</button></div>`;
  const d = R.before - R.after;
  return `${head}<h1>${d > 0 ? `From ${R.before} down to ${R.after}` : d === 0 ? `Still at ${R.after}` : `From ${R.before} up to ${R.after}`}</h1>
    <div class="card"><p>${d >= 2 ? "That's a real shift, and you made it happen. It's saved, so over time you'll see which of these works best for you."
      : d > 0 ? "A small shift counts. One point is the difference between stuck and moving."
      : "It didn't move this time. That happens. Some states need a different approach or a second pass, and some need another person."}</p></div>
    <div class="row"><a class="btn" href="#/today">Done</a><a class="btn ghost" href="#/rescue">Try a different one</a><button class="btn ghost" data-act="newChat" data-kind="general">Talk to the guide</button></div>
    ${R.after >= 8 ? `<p class="small">If this is more than a bad mood, go to <a href="#/crisis">Help now</a>.</p>` : ""}`;
};

views.explore = () => {
  S.threads = S.threads.filter(t => t.title || t.notes.length || Object.values(t.answers).some(v => (Array.isArray(v) ? v.length : v !== "" && v != null)));
  const th = S.threads.slice().sort((a, b) => b.t - a.t);
  return `<div><h1>Work it through</h1><p class="lede">For the things that aren't going away, and the things you can't seem to change. Each of these is a method therapists use to get underneath a problem. What you write is kept, so you can come back and add to it.</p></div>
    <div class="grid two">
      <a class="card" href="#/emdr"><h3>EMDR-style processing</h3><p class="muted small">Left-right stimulation while you hold a memory or an upset in mind, so it loses its charge. Also a calm-place exercise.</p><span class="tag">Eye movement desensitisation and reprocessing</span></a>
      <a class="card" href="#/shadow"><h3>Shadow work and archetypes</h3><p class="muted small">Jungian exercises for the parts of yourself you've hidden or disowned, and the 48-question archetype assessment.</p><span class="tag">Jungian depth psychology</span></a>
    </div>
    <div class="grid">${IW.tools.map(t => `<button class="card" style="text-align:left;font:inherit;cursor:pointer" data-act="newThread" data-tool="${t.id}"><h3>${esc(t.name)}</h3><p class="muted small">${esc(t.intro)}</p><span class="tag">${esc(t.m)}</span></button>`).join("")}</div>
    ${th.length ? `<div class="card"><h2>Your work so far</h2><ul class="slist">${th.map(t => { const tool = IW.tools.find(x => x.id === t.tool); return `<li><a href="#/thread/${t.id}"><span>${esc(t.title || firstLine(t) || tool.name)}<small>${esc(tool.name)} · ${fmtDate(t.t)}</small></span></a></li>`; }).join("")}</ul></div>` : ""}`;
};
const firstLine = t => { const v = Object.values(t.answers).find(x => typeof x === "string" && x.trim()); return v ? v.trim().slice(0, 70) : ""; };

views.thread = id => {
  const ix = S.threads.findIndex(t => t.id === id); if (ix < 0) return views.explore();
  const t = S.threads[ix], tool = IW.tools.find(x => x.id === t.tool), base = `threads.${ix}`;
  return `<a class="back" href="#/explore">← Work it through</a>
    <div><h1>${esc(tool.name)}</h1><p style="margin-top:10px"><span class="tag">${esc(tool.m)}</span></p></div>
    <p class="lede">${esc(tool.intro)}</p>
    <div class="card"><label class="fld"><span>A name for this, so you can find it again</span><input type="text" data-bind="${base}.title" value="${esc(t.title)}"></label></div>
    <div class="card">${tool.f.map(f => field(`${base}.answers`, f)).join("")}</div>
    <div class="card"><h2>Coming back to it</h2><p class="muted small">Things look different after a few days. Add what you've noticed since.</p>
      ${t.notes.map(n => `<div class="flash"><span class="muted small">${fmtDate(n.t)}</span><br>${esc(n.text).replace(/\n/g, "<br>")}</div>`).join("")}
      <textarea data-bind="U.note" rows="2" aria-label="New note">${esc(U.note)}</textarea><div class="row end"><button class="btn small ghost" data-act="addNote" data-ix="${ix}">Add note</button></div></div>
    <div class="row between"><button class="btn ghost" data-act="newChat" data-kind="thread" data-ref="${t.id}">Take this to the guide</button><button class="btn danger small" data-act="delThread" data-ix="${ix}">Delete</button></div>`;
};

views.checkin = () => `
  <a class="back" href="#/progress">← Progress</a>
  <div><h1>Check-in</h1><p class="lede">Over the last two weeks, how often have you been bothered by each of these?</p></div>
  <div class="card"><h2>Low mood</h2>${questions("phq")}</div>
  <div class="card"><h2>Anxiety</h2>${questions("gad")}</div>${flash()}
  <div class="row end"><button class="btn" data-act="saveCheck">Save check-in</button></div>`;

function scoreChart() {
  const c = S.checkins, n = c.length, W = 380, H = 210, L = 26, R = 12, T = 12, B = 26;
  const x = i => (n === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1)), y = v => T + (27 - v) * (H - T - B) / 27;
  const line = k => c.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const dots = k => c.map((p, i) => `<circle class="dot ${k}" cx="${x(i).toFixed(1)}" cy="${y(p[k]).toFixed(1)}" r="4.5"><title>${fmtDate(p.t)}: ${p[k]}</title></circle>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Check-in scores over time">
    ${[0, 5, 15, 20, 27].map(v => `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("")}
    <line class="thr" x1="${L}" x2="${W - R}" y1="${y(10)}" y2="${y(10)}"/><text x="${L - 6}" y="${y(10) + 4}" text-anchor="end">10</text>
    <text x="${L}" y="${H - 6}">${fmtDate(c[0].t)}</text>${n > 1 ? `<text x="${W - R}" y="${H - 6}" text-anchor="end">${fmtDate(c[n - 1].t)}</text>` : ""}
    ${n > 1 ? `<path class="phq" d="${line("phq")}"/><path class="gad" d="${line("gad")}"/>` : ""}${dots("phq")}${dots("gad")}</svg>
    <div class="legend"><span><i style="background:var(--accent)"></i>Low mood (PHQ-9)</span><span><i style="background:var(--gad)"></i>Anxiety (GAD-7)</span><span><i style="background:var(--gold)"></i>10 = moderate</span></div>`;
}

views.progress = () => {
  const c = S.checkins, l = lastCheck(), b = c[0], r = readiness(), moods = S.moods.slice(-30);
  const weeks = S.profile ? (Date.now() - S.profile.startedAt) / (7 * DAY) : 0;
  const stuck = S.stage === "program" && c.length >= 3 && weeks >= 6 && l.phq + l.gad >= b.phq + b.gad && (l.phq >= 10 || l.gad >= 10);
  const delta = (k) => c.length > 1 ? (l[k] - b[k] === 0 ? "no change since you started" : `${Math.abs(l[k] - b[k])} ${l[k] < b[k] ? "lower" : "higher"} than when you started`) : "your starting point";
  const helped = Object.entries(S.sessions).filter(([, v]) => v.helpful >= 7 && v.doneAt).sort((a, b2) => b2[1].helpful - a[1].helpful).slice(0, 5);
  return `<div><h1>Progress</h1></div>${flash()}
    ${l && l.phq >= 20 ? `<div class="card warn"><h3>Please see a doctor or therapist</h3><p>Your latest low-mood score is in the severe range. Use this alongside professional care.</p></div>` : ""}
    ${stuck ? `<div class="card warn"><h3>Time to add a person</h3><p>You've been working for ${Math.floor(weeks)} weeks and your scores haven't come down. That tells you something useful: self-guided work on its own isn't enough for this right now. A therapist, a medication review, or a hormone review if that applies, is the next step. Keep using the tools here alongside it.</p></div>` : ""}
    ${stayedWell() ? `<div class="card soft"><h2>Three steady months</h2><p>Your scores have stayed low since you graduated. You don't need the check-ins any more.</p><button class="btn" data-act="finish">Finish check-ins</button></div>` : ""}
    ${l ? `<div class="stats"><div class="card"><p class="eyebrow">Low mood</p><div class="big">${l.phq}</div><p class="muted small">${IW.band("phq", l.phq)} · ${delta("phq")}</p></div>
      <div class="card"><p class="eyebrow">Anxiety</p><div class="big">${l.gad}</div><p class="muted small">${IW.band("gad", l.gad)} · ${delta("gad")}</p></div></div>
      <div class="card">${scoreChart()}<div class="row between"><span class="muted small">Last check-in ${fmtDate(l.t)}${checkDue() && S.stage !== "graduated" ? " · due now" : ""}</span><a class="btn small ghost" href="#/checkin">Check in</a></div></div>` : ""}
    <div class="card"><h2>${S.stage === "program" ? "Graduation" : S.stage === "maintenance" ? "Maintenance" : "Finished"}</h2>
      ${S.stage === "program" ? `<ul class="check"><li class="${r.sessionsOk ? "yes" : ""}">${r.done} of ${r.total} sessions done</li><li class="${r.scoresOk ? "yes" : ""}">Scores settled in the low range</li><li class="${r.planOk ? "yes" : ""}">Early-warning plan written</li></ul><a class="small" href="#/graduate">See what graduating involves</a>`
        : S.stage === "maintenance" ? `<p>Graduated ${fmtDate(S.graduatedAt)}. Check-ins every ${checkEvery()} days. If things slip, your early-warning plan is in <a href="#/session/s2">Staying well, session 2</a>.</p><button class="btn small quiet" data-act="resume">Go back into the program</button>`
        : `<p>You finished on your own terms. Come back to any of it whenever you want.</p><button class="btn small quiet" data-act="resume">Go back into the program</button>`}</div>
    ${moods.length ? `<div class="card"><h2>Mood, last ${moods.length} entries</h2><div class="moodbars" role="img" aria-label="Recent mood ratings">${moods.map(m => `<i style="height:${Math.max(4, m.v * 10)}%" title="${fmtDate(m.t)}: ${m.v}${m.note ? " · " + esc(m.note) : ""}"></i>`).join("")}</div></div>` : ""}
    ${helped.length ? `<div class="card"><h2>Sessions that helped you most</h2><ul class="slist">${helped.map(([id]) => `<li class="done"><a href="#/session/${id}"><span class="st">✓</span><span>${esc(SES[id].s.t)}<small>${esc(S.sessions[id].takeaway || SES[id].s.m)}</small></span></a></li>`).join("")}</ul></div>` : ""}`;
};

views.crisis = () => {
  const from = U.fromCheck; U.fromCheck = false;
  const has = IW.safetyPlan.some(f => S.safety[f[0]]);
  return `<div><h1>Help now</h1></div>
    ${from ? `<div class="card soft"><p>You marked that you've had thoughts of being better off dead or of hurting yourself. Thank you for answering honestly. Those thoughts are a sign of how much pain you're in, and they deserve a real person's attention. Please talk to someone today.</p></div>` : ""}
    <div class="card warn"><h2>If you're thinking about ending your life, or you're not safe</h2>
      <div class="tel"><a href="tel:988">Call 988 · Suicide &amp; Crisis Lifeline</a><a href="sms:988">Text 988</a><a href="sms:741741?&body=HOME">Text HOME to 741741 · Crisis Text Line</a><a href="tel:911">Call 911 if you're in immediate danger</a></div>
      <p class="small">These are US numbers, open 24 hours. Elsewhere, call your local emergency number.</p></div>
    <div class="card"><h2>Right now</h2><ul class="plain"><li>Tell one person how bad it is. Say the actual words.</li><li>Put distance between you and anything you could use to hurt yourself.</li><li>Don't be alone if you can help it.</li><li>The feeling is at its peak. It will come down. You only have to get through the next hour.</li></ul>
      <a class="btn ghost small" href="#/rescue">Steady myself first</a></div>
    <div class="card"><div class="row between"><h2>My safety plan</h2><a class="btn small ghost" href="#/safety">${has ? "Edit" : "Write it now"}</a></div>
      ${has ? IW.safetyPlan.filter(f => S.safety[f[0]]).map(f => `<div><strong class="small">${esc(f[1])}</strong><p>${esc(S.safety[f[0]]).replace(/\n/g, "<br>")}</p></div>`).join("") : `<p class="muted">A safety plan is a short list you write while you're steady, to follow when you're not. It takes ten minutes and it is one of the things that reliably helps.</p>`}</div>`;
};

views.safety = () => `<a class="back" href="#/crisis">← Help now</a><div><h1>My safety plan</h1><p class="lede">Write this while you're steady. Keep it short and specific.</p></div>
  <div class="card">${IW.safetyPlan.map(f => field("safety", [f[0], "ta", f[1]])).join("")}</div><div class="row end"><a class="btn" href="#/crisis">Done</a></div>`;

views.settings = () => `<div><h1>Settings</h1></div>${flash()}
  ${S.profile ? `<div class="card"><label class="fld"><span>Your name</span><input type="text" data-bind="profile.name" value="${esc(S.profile.name)}"></label></div>` : `<a class="back" href="#/intake">← Back to the start</a>`}
  <div class="card"><h2>The guide</h2><p class="muted small">The guide is Claude, made by Anthropic. To use it you need your own API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener">console.anthropic.com</a> (Settings → API keys). You pay Anthropic directly for what you use. Paste the key below. It is stored only in this browser and sent only to Anthropic.</p>
    <label class="fld"><span>Anthropic API key</span><input type="password" data-bind="settings.apiKey" value="${esc(S.settings.apiKey)}" autocomplete="off" spellcheck="false" placeholder="sk-ant-…"></label>
    <p class="muted small">Model: Claude Opus 5.5. If a message is declined by that model's safety filters, the request automatically falls back to another Claude model.</p></div>
  <div class="card"><h2>Your data</h2><p class="muted small">Everything you write is stored in this browser on this device. Unless you sign in below, it is stored nowhere else, and clearing your browser data erases it, so save a backup now and then. The backup file contains everything you've written; your API key is left out.</p>
    <div class="row"><button class="btn small ghost" data-act="export">Save a backup</button><label class="btn small ghost" style="cursor:pointer">Restore from backup<input type="file" accept="application/json,.json" data-act-change="import" hidden></label><button class="btn small danger" data-act="reset">Erase everything</button></div></div>
  <div class="card"><h2>Save across your devices</h2><p class="muted small">Sign in with Google and what you write here is also kept in your own private space online, so your phone and computer stay in step. It is the same sign-in Synthesis uses. Conversations with the guide and your API key stay on each device.</p>
    <div class="row between"><span class="small" id="sync-status">${syncLine()}</span>${sync.user ? `<button class="btn small quiet" data-act="syncOut">Sign out</button>` : `<button class="btn small" data-act="syncIn">Sign in with Google</button>`}</div></div>
  <div class="card"><h2>Bring in your Synthesis entries</h2>${synthesisHere() ? `<p>Synthesis has been used in this browser, so your entries can come straight across.</p><div class="row"><button class="btn small" data-act="synthesisLocal">Bring them in now</button></div>` : ""}<p class="muted small">Vision Board, Journal and Shadow Work used to live in Synthesis. To carry your entries over: in Synthesis open Profile and press Export Backup, then choose that file here. Nothing already here is overwritten, and you can do this more than once.</p>
    <div class="row"><label class="btn small ghost" style="cursor:pointer">Choose a Synthesis backup<input type="file" accept="application/json,.json" data-act-change="synthesis" hidden></label></div></div>
  <div class="card"><h2>Background</h2><p class="muted small">Your zen garden paintings. Pick one, or let it change each day.</p>
    <div class="bgpicks">${BGS.map(b => `<button type="button" class="bgpick" data-act="bg" data-val="${b[0]}" aria-pressed="${bgChoice() === b[0]}">${b[2] ? `<img src="${b[2]}" alt="" loading="lazy">` : `<i class="${b[0]}"></i>`}<span>${b[1]}</span></button>`).join("")}
      <label class="bgpick" aria-pressed="${bgChoice() === "photo"}" style="cursor:pointer"><i class="photo"></i><span>${hasPhoto() ? "Change my photo" : "My own photo"}</span><input type="file" accept="image/*" data-act-change="photo" hidden></label></div>
    <p class="muted small">A photo of your own stays in this browser only.</p></div>
  <p class="muted small">Inner Work is a self-help tool. It is not medical care and does not replace a doctor or therapist.</p>`;

views.guide = id => {
  if (!S.settings.apiKey) return `<div><h1>Your guide</h1><p class="lede">Someone to think out loud with. The guide knows the program, has read what you've chosen to bring, and helps you go deeper than a form can.</p></div>
    <div class="card"><h2>Set it up</h2><p>The guide is Claude, made by Anthropic. It needs an API key, which you get from <a href="https://console.anthropic.com/" target="_blank" rel="noopener">console.anthropic.com</a>. You pay Anthropic directly for what you use; a long conversation costs a few cents.</p>
      <label class="fld"><span>Paste your Anthropic API key</span><input type="password" data-bind="settings.apiKey" autocomplete="off" spellcheck="false" placeholder="sk-ant-…"></label>
      <div class="row end"><button class="btn" data-act="rerender">Save</button></div>
      <p class="muted small">The key stays in this browser. When you talk to the guide, your messages and a summary of your program are sent to Anthropic to get a reply. Nothing else leaves this device. Everything else in the app works without it.</p></div>`;
  const chat = id && S.chats.find(c => c.id === id);
  if (!chat) {
    S.chats = S.chats.filter(c => c.msgs.length);
    return `<div><h1>Your guide</h1><p class="lede">Talk through whatever is on your mind. It isn't a therapist and won't pretend to be one, and it will be honest with you.</p></div>
      <div class="row"><button class="btn" data-act="newChat" data-kind="general">New conversation</button></div>
      ${S.chats.length ? `<div class="card"><h2>Earlier conversations</h2><ul class="slist">${S.chats.slice().sort((a, b) => b.t - a.t).map(c => `<li><a href="#/guide/${c.id}"><span>${esc(c.title || "Conversation")}<small>${fmtDate(c.t)}</small></span></a></li>`).join("")}</ul></div>` : ""}
      <p class="muted small">In an emergency the guide is not enough. Use <a href="#/crisis">Help now</a>.</p>`;
  }
  return `<a class="back" href="#/guide">← Conversations</a>
    ${chat.about ? `<p class="eyebrow">About: ${esc(chat.about)}</p>` : ""}
    <div class="chat" aria-live="polite">${chat.msgs.length ? "" : `<p class="muted">Say what's on your mind. There's no right way to start.</p>`}
      ${chat.msgs.map(m => m.role === "note" ? `<div class="msg note">${esc(m.text)}${m.retry ? ` <button class="btn small ghost" data-act="retry" data-id="${chat.id}">Try again</button>` : ""}</div>` : `<div class="msg ${m.role}">${m.role === "user" ? esc(textOf(m)) : paras(textOf(m))}</div>`).join("")}
      ${U.sending ? `<div class="msg assistant" id="stream"><span class="typing">Thinking…</span></div>` : ""}</div>
    <div class="composer"><textarea id="composer" data-bind="U.draft" rows="1" placeholder="Write to your guide…" aria-label="Message" ${U.sending ? "disabled" : ""}>${esc(U.draft)}</textarea><button class="btn" data-act="send" data-id="${chat.id}" ${U.sending ? "disabled" : ""}>Send</button></div>`;
};
const textOf = m => typeof m.content === "string" ? m.content : m.content.filter(b => b.type === "text").map(b => b.text).join("\n\n");

/* ---------- vision board, journal, shadow work (moved here from Synthesis; code in life.js) ---------- */
const clone = o => JSON.parse(JSON.stringify(o));
function ensureLife() {
  if (!S.life) S.life = { visionBoard: [], manifestationJournal: [], shadowWork: {} };
  const L = S.life, def = IW.life.defaultShadow;
  L.visionBoard = L.visionBoard || []; L.manifestationJournal = L.manifestationJournal || []; L.shadowWork = L.shadowWork || {};
  for (const k in def) if (!(k in L.shadowWork)) L.shadowWork[k] = clone(def[k]);
  if (!S.emdr) S.emdr = [];
  return L;
}
const MOON = [
  ["A fresh start. Set intentions and plant the seeds of what you want to grow.", "New beginnings and intention-setting"],
  ["Time for setting intentions and planting seeds for your manifestations. Focus on growth and expansion.", "Clarity and vision-setting"],
  ["Momentum meets resistance. Make decisions and push through what is in the way.", "Commitment and action"],
  ["Refine and adjust. Look at what is working and get ready for what is coming.", "Refinement and patience"],
  ["Things come to light. Celebrate what has arrived and release what is finished.", "Celebration and release"],
  ["Share what you have learned and give thanks.", "Gratitude and sharing"],
  ["Let go. Forgive, clear out and make room.", "Release and forgiveness"],
  ["Rest and reflect before the next cycle begins.", "Rest and surrender"]
];
function moonNow() {
  const SYN = 29.530588853, age = ((((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / DAY) % SYN) + SYN) % SYN;
  const i = Math.floor(age / SYN * 8 + 0.5) % 8, ph = IW.life.phases;
  let days = (i + 0.5) / 8 * SYN - age; if (days < 0) days += SYN;
  return { phase: ph[i].name, emoji: ph[i].emoji, percentage: Math.round((1 - Math.cos(2 * Math.PI * age / SYN)) / 2 * 100), nextPhase: ph[(i + 1) % 8].name, daysUntilNext: Math.max(1, Math.round(days)), description: MOON[i][0], manifestationFocus: MOON[i][1] };
}
window.APP_DATA = { get user() { return ensureLife(); }, shadowWorkExercises: IW.life.exercises, moonPhases: { get current() { return moonNow(); }, phases: IW.life.phases } };
window.saveProgress = () => saveNow();
window.toast = (msg, type) => {
  const el = document.createElement("div"); el.className = "toast " + (type || "info"); el.textContent = msg; $("#toasts").appendChild(el);
  const ms = 3200 + Math.min(5000, String(msg).length * 35); setTimeout(() => el.classList.add("out"), ms); setTimeout(() => el.remove(), ms + 400);
};
window.premiumFeatures = new window.PremiumFeatures({ goBack: () => history.back() });
const lifeView = (title, lede, id) => `<div><h1>${title}</h1><p class="lede">${lede}</p></div><div class="life"><div class="${id}" id="${id}"></div></div>`;
views.vision = () => lifeView("Vision Board", "What you are growing toward, and where the moon is tonight.", "vision-board-content");
views.journal = () => lifeView("Journal", "Gratitude, affirmations, intentions, and a few honest lines each day.", "manifestation-content");
views.shadow = () => lifeView("Shadow Work", "Meeting the parts of yourself you have hidden, denied or disowned.", "shadow-work-content");
const after = {
  vision: () => window.premiumFeatures.renderVisionBoard(),
  journal: () => window.premiumFeatures.renderManifestation(),
  shadow: () => window.premiumFeatures.renderShadowWork()
};
const journalToday = () => { const d = new Date().toISOString().split("T")[0], e = ensureLife().manifestationJournal.find(x => x.date === d); return !!(e && ((e.gratitude || []).length || (e.goals || []).length || (e.affirmations || []).length || e.notes)); };
const lifeStats = () => { const L = ensureLife(); return { entries: L.manifestationJournal.length, streak: window.premiumFeatures.getAffirmationStreak(), visions: L.visionBoard.length, exercises: L.shadowWork.completedExercises.length, reflections: (L.shadowWork.reflections || []).length }; };
const hasPhoto = () => { try { return !!localStorage.getItem("innerwork.bg"); } catch (e) { return false; } };
const BGS = [["zen1", "Waterfall garden", "assets/bg/zen-waterfall-t.webp"], ["zen2", "Raked sand garden", "assets/bg/zen-garden-t.webp"], ["zen3", "Forest falls", "assets/bg/zen-falls-t.webp"], ["daily", "A new one each day", ""], ["drawn", "Drawn forest", ""]];
const bgChoice = () => { const c = S.settings.bg || "zen1"; return c === "photo" && !hasPhoto() ? "zen1" : c; };
ensureLife();

/* ---------- EMDR-style processing ---------- */
const NEG = ["I'm not good enough", "It was my fault", "I'm not safe", "I'm powerless", "I'm unlovable", "I can't trust myself", "I'm a failure", "I should have done something"];
const POS = ["I'm good enough", "I did the best I could", "I'm safe now", "I have choices now", "I'm lovable", "I can trust myself", "I can succeed", "It's over and I survived"];
const READY = [
  "The memory I'm choosing is upsetting but not my worst: about 4 to 7 out of 10",
  "I don't lose time or feel far away from my body when I'm upset",
  "I have no urge to hurt myself right now",
  "I have 45 minutes, somewhere private, and nothing demanding straight afterwards",
  "I have a calm place and a grounding statement ready"
];
const pick = (text, picks) => (text || "").trim() || (picks && picks[0]) || "";
function blsBox(passes, ms, label) {
  const m = S.settings.bls || "both";
  return `<div class="bls" data-passes="${passes}" data-ms="${ms}"><div class="track"><i class="dot"></i></div><div class="btxt">${label || "Follow the dot with your eyes, keeping your head still."}</div>
    <div class="chips" style="justify-content:center">${[["both", "Dot and sound"], ["dot", "Dot only"], ["sound", "Sound only"]].map(o => `<button type="button" class="chip" data-act="blsMode" data-val="${o[0]}" aria-pressed="${m === o[0]}">${o[1]}</button>`).join("")}</div>
    <button type="button" class="btn" data-act="bls">Start a set</button>
    <p class="muted small" style="text-align:center">Sound needs headphones to move left and right. You can also tap your knees or shoulders alternately in time with it, eyes closed.</p></div>`;
}
views.emdr = mode => {
  if (mode !== "calm" && mode !== "process") {
    U.emdr = null;
    return `<a class="back" href="#/explore">← Deeper</a>
      <div><h1>EMDR-style processing</h1><p class="lede">Eye movement desensitisation and reprocessing. You hold a distressing memory in mind while your attention moves left and right, and the brain refiles it as something that is over.</p></div>
      <div class="card warn"><h3>What this is and isn't</h3><p>With a trained therapist, EMDR is one of the best-evidenced treatments for trauma. This is a self-guided version of the same steps. Use it for memories and upsets in the middle range: things that still sting, not the worst things that have happened to you. For those, for childhood abuse, or if you tend to go numb or far away, work with an EMDR therapist. The EMDR International Association keeps a directory.</p></div>
      <div class="grid two">
        <a class="card" href="#/emdr/calm"><h3>Build your calm place</h3><p class="muted small">Start here. A short exercise that gives you somewhere to return to. Safe to do any time.</p><span class="go">${S.calm ? "Strengthen it" : "Begin"} →</span></a>
        <a class="card" href="#/emdr/process"><h3>Process a memory or an upset</h3><p class="muted small">The full sequence: choose a target, sets of left-right stimulation, strengthen a new belief, body scan, close. About 45 minutes.</p><span class="go">Begin →</span></a>
      </div>
      ${S.emdr.length ? `<div class="card"><h2>Your sessions</h2><ul class="slist">${S.emdr.slice().reverse().map(e => `<li><a><span>${esc(e.target)}<small>${fmtDate(e.t)} · distress ${e.sud0} → ${e.sud1} · ${e.sets} sets${e.pc ? " · “" + esc(e.pc) + "”" : ""}</small></span></a></li>`).join("")}</ul></div>` : ""}`;
  }
  if (!U.emdr || U.emdr.mode !== mode) U.emdr = { mode, step: 0, phase: "set", sets: 0, notes: [], ready: [], note: "", f: mode === "calm" && S.calm ? { place: S.calm.place, word: S.calm.word } : {} };
  const E = U.emdr, F = E.f, head = `<a class="back" href="#/emdr">← EMDR</a>`, stop = `<button class="btn quiet small" data-act="emdrStop">I need to stop</button>`;
  const more = (again, next) => `<div class="row between">${stop}<div class="row"><button class="btn ghost" data-act="emdrAgain">${again}</button><button class="btn" data-act="emdrNext">${next}</button></div></div>`;

  if (mode === "calm") {
    if (E.step === 0) return `${head}<h1>Your calm place</h1>
      <div class="card"><p>Picture somewhere, real or imagined, where you feel settled and safe. Choose a place with no link to anyone who has hurt you.</p>
        <label class="fld"><span>Describe it: what you see, hear, smell, and feel on your skin</span><textarea data-bind="U.emdr.f.place" rows="4">${esc(F.place || "")}</textarea></label>
        <label class="fld"><span>One word that sums it up</span><input type="text" data-bind="U.emdr.f.word" value="${esc(F.word || "")}"></label></div>
      <div class="row end"><button class="btn" data-act="emdrNext">Next</button></div>`;
    if (E.step === 1) return `${head}<h1>Let it sink in</h1>
      <div class="card"><p>Bring up the place${F.word ? ` and your word, “${esc(F.word)}”` : ""}. Notice where in your body you feel the calm. Then follow one slow set.</p>${blsBox(8, 1700, E.phase === "after" ? "Notice the feeling. Has it deepened?" : "")}
        <p class="muted small">Three or four slow sets is plenty. If anything unpleasant comes up, stop and pick a different place.</p></div>
      <div class="row end"><button class="btn" data-act="emdrNext">That's enough</button></div>`;
    return `${head}<h1>Saved</h1><div class="card"><p>Your calm place is saved. Say your word${F.word ? `, “${esc(F.word)}”,` : ""} and picture it whenever you need to settle. The more often you visit when you're steady, the faster it works when you're not.</p></div>
      <div class="row"><a class="btn" href="#/emdr">Done</a></div>`;
  }

  const nc = pick(F.nc, F.ncPick), pc = pick(F.pc, F.pcPick);
  if (E.step === 0) return `${head}<h1>Before you begin</h1>
    <div class="card"><p>Tick each of these honestly. If one doesn't fit today, do the calm place exercise instead and come back another time.</p>${chips("U.emdr.ready", READY, true)}</div>
    <div class="card warn"><p>If you have epilepsy or a history of seizures, or eye movements give you migraines or dizziness, use <strong>sound only</strong> or tapping, not the moving dot.</p></div>${flash()}
    <div class="row end"><button class="btn" data-act="emdrNext">Next</button></div>`;
  if (E.step === 1) return `${head}<p class="eyebrow">Step 1 of 5</p><h1>Choose the target</h1>
    <div class="card"><label class="fld"><span>The memory or upset. A sentence is enough.</span><textarea data-bind="U.emdr.f.target" rows="2">${esc(F.target || "")}</textarea></label>
      <label class="fld"><span>The worst moment of it, as a still picture</span><textarea data-bind="U.emdr.f.image" rows="2">${esc(F.image || "")}</textarea></label>
      <div class="fld"><span>When you look at that picture, what do you believe about yourself?</span>${chips("U.emdr.f.ncPick", NEG)}<input type="text" data-bind="U.emdr.f.nc" value="${esc(F.nc || "")}" placeholder="or in your own words" style="margin-top:10px"></div>
      <div class="fld"><span>What would you rather believe about yourself?</span>${chips("U.emdr.f.pcPick", POS)}<input type="text" data-bind="U.emdr.f.pc" value="${esc(F.pc || "")}" placeholder="or in your own words" style="margin-top:10px"></div>
      ${scale("U.emdr.f.voc", "Thinking of the memory, how true do those better words feel in your gut?", "completely false", "completely true", 1, 7)}
      <label class="fld"><span>What emotion comes up?</span><input type="text" data-bind="U.emdr.f.emotion" value="${esc(F.emotion || "")}"></label>
      ${scale("U.emdr.f.sud", "How disturbing does it feel right now?", "none", "the worst")}
      <label class="fld"><span>Where do you feel it in your body?</span><input type="text" data-bind="U.emdr.f.body" value="${esc(F.body || "")}"></label></div>${flash()}
    <div class="row between">${stop}<button class="btn" data-act="emdrNext">Start processing</button></div>`;
  if (E.step === 2) {
    if (E.phase === "after") return `${head}<p class="eyebrow">Step 2 of 5 · set ${E.sets}</p><h1>Take a breath</h1>
      <div class="card"><p>Let it go blank for a moment. Then: what do you notice now? A thought, a feeling, an image, a body sensation. Whatever is there.</p>
        <textarea data-bind="U.emdr.note" rows="2" aria-label="What you notice">${esc(E.note)}</textarea>
        ${E.sets % 6 === 0 ? `<p class="muted small">You've done ${E.sets} sets. It's a good moment to check the level.</p>` : ""}</div>
      <div class="row between">${stop}<div class="row"><button class="btn ghost" data-act="emdrCheck">Check the level</button><button class="btn" data-act="emdrAgain">Go with that</button></div></div>`;
    if (E.phase === "sud") return `${head}<p class="eyebrow">Step 2 of 5 · ${E.sets} sets so far</p><h1>Check the level</h1>
      <div class="card"><p>Go back to the original memory: ${esc(F.target)}</p>${scale("U.emdr.f.sudNow", "How disturbing is it now?", "none", "the worst")}
        <p class="muted small">You started at ${E.sud0}. A 0 or 1 means it has settled. If it's higher, do more sets, or close for today and come back to it: several sittings is normal. If it has climbed well above where you started, close for today.</p></div>
      <div class="row between"><button class="btn quiet" data-act="emdrStop">Close for today</button><div class="row"><button class="btn ghost" data-act="emdrAgain">More sets</button><button class="btn" data-act="emdrNext">It has settled</button></div></div>`;
    return `${head}<p class="eyebrow">Step 2 of 5 · ${E.sets} sets so far</p><h1>Reprocessing</h1>
      <div class="card"><p>Bring up the picture, the words “${esc(nc)}”, and the feeling in your body. Then let it go wherever it goes and just follow. Don't try to make anything happen.</p>${blsBox(24, 1050)}</div>
      <div class="row between">${stop}<button class="btn ghost" data-act="emdrCheck">Check the level</button></div>`;
  }
  if (E.step === 3) return `${head}<p class="eyebrow">Step 3 of 5</p><h1>Strengthen the new belief</h1>
    <div class="card"><p>Hold the original memory together with the words “${esc(pc)}”.</p>${scale("U.emdr.f.vocNow", "How true do the words feel now?", "completely false", "completely true", 1, 7)}${blsBox(12, 1050, E.phase === "after" ? "Check the words again. Truer?" : "")}</div>
    ${more("Another set", "It feels true")}`;
  if (E.step === 4) return `${head}<p class="eyebrow">Step 4 of 5</p><h1>Body scan</h1>
    <div class="card"><p>Close your eyes. Hold the memory and the words “${esc(pc)}” together, and scan slowly from your head to your feet. If you find tightness, heaviness or anything odd, rest your attention on it and do a set. Repeat until it clears or turns neutral.</p>${blsBox(12, 1050, E.phase === "after" ? "Scan again. What's there now?" : "")}</div>
    ${more("Another set", "My body feels clear")}`;
  if (E.step === 5) return `${head}<p class="eyebrow">Step 5 of 5</p><h1>Close the session</h1>
    <div class="card"><p>Whether or not it feels finished, close it down properly. Picture a strong container and put anything left over inside it; it will keep until next time. Then go to your calm place${S.calm && S.calm.word ? ` and say your word, “${esc(S.calm.word)}”` : ""}, and follow one slow set.</p>${blsBox(8, 1700, E.phase === "after" ? "Feel your feet on the floor. Look around the room." : "")}
      ${scale("U.emdr.f.sudEnd", "How disturbing is the memory now?", "none", "the worst")}
      <label class="fld"><span>What do you want to remember from this session?</span><textarea data-bind="U.emdr.f.learned" rows="2">${esc(F.learned || "")}</textarea></label></div>
    <div class="card soft"><h3>For the next day or two</h3><p>Processing often carries on afterwards. You may get vivid dreams, new memories, or shifts in how you feel. Jot them down. Be gentle with yourself tonight: eat, rest, skip the alcohol. If you feel unsafe at any point, use Help now.</p></div>
    <div class="row end"><button class="btn" data-act="emdrSave">Save and finish</button></div>`;
  const last = S.emdr[S.emdr.length - 1];
  return `${head}<h1>${last && last.sud1 < last.sud0 ? `From ${last.sud0} down to ${last.sud1}` : "Session saved"}</h1>
    <div class="card"><p>${last && last.sud1 <= 1 ? "That memory has lost its charge. Check it again in a few days; if it stays quiet, it's done." : "It doesn't have to finish in one sitting. Come back to the same memory in a few days and carry on from where it is then."}</p></div>
    <div class="row"><a class="btn" href="#/today">Done</a><a class="btn ghost" href="#/journal">Write about it</a></div>`;
};

let blsRun = 0, audio;
function blip(pan) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), gn = audio.createGain(), t = audio.currentTime;
    o.frequency.value = 330; gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.22, t + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
    let out = gn; if (audio.createStereoPanner) { const p = audio.createStereoPanner(); p.pan.value = pan; gn.connect(p); out = p; }
    o.connect(gn); out.connect(audio.destination); o.start(t); o.stop(t + 0.19);
  } catch (e) { /* no sound available */ }
}
function startBLS(box) {
  const run = ++blsRun, passes = +box.dataset.passes, ms = +box.dataset.ms, mode = S.settings.bls || "both";
  const dot = $(".dot", box), track = $(".track", box), txt = $(".btxt", box), btn = $('[data-act="bls"]', box);
  box.classList.add("on"); track.classList.toggle("nodot", mode === "sound"); btn.hidden = true;
  const t0 = performance.now(); let last = -1;
  const frame = now => {
    if (run !== blsRun) return;
    const el = now - t0, pass = Math.floor(el / ms);
    if (pass >= passes) { if (U.emdr) { U.emdr.phase = "after"; U.emdr.sets++; } U.keepScroll = true; render(); return; }
    if (pass !== last) { last = pass; if (mode !== "dot") blip(pass % 2 ? 1 : -1); txt.textContent = "Just notice."; }
    const p = (1 - Math.cos(Math.PI * (el % ms) / ms)) / 2, x = pass % 2 ? 1 - p : p;
    dot.style.transform = `translateX(${(x * (track.clientWidth - dot.offsetWidth)).toFixed(1)}px)`;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
const fixRanges = () => document.querySelectorAll("#view input[type=range]").forEach(r => { if (get(r.dataset.bind) == null) set(r.dataset.bind, +r.value); });
const moreActs = {
  bls(el) { startBLS(el.closest(".bls")); },
  blsMode(el) { S.settings.bls = el.dataset.val; save(); el.parentElement.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b === el))); },
  emdrAgain() { const E = U.emdr; if (E.note.trim()) E.notes.push(E.note.trim()); E.note = ""; E.phase = "set"; render(); },
  emdrCheck() { const E = U.emdr; if (E.note.trim()) E.notes.push(E.note.trim()); E.note = ""; E.f.sudNow = null; E.phase = "sud"; render(); },
  emdrStop() { const E = U.emdr; if (E.mode === "calm" || E.step < 2) return go("#/emdr"); fixRanges(); E.step = 5; E.phase = "set"; render(); },
  emdrNext() {
    const E = U.emdr, F = E.f; fixRanges();
    if (E.mode === "calm") { if (E.step === 1) { S.calm = { place: F.place || "", word: (F.word || "").trim() }; saveNow(); } E.step++; E.phase = "set"; return render(); }
    if (E.step === 0 && E.ready.length < READY.length) { U.flash = "Tick each one before going on. If one doesn't fit today, do the calm place exercise instead."; U.keepScroll = true; return render(); }
    if (E.step === 1) {
      if (!(F.target || "").trim() || !pick(F.nc, F.ncPick) || !pick(F.pc, F.pcPick)) { U.flash = "Fill in the memory and both beliefs first."; U.keepScroll = true; return render(); }
      if (F.sud >= 9) { U.flash = "That's very high for working on alone. Choose something in the 4 to 7 range, or take this one to an EMDR therapist."; U.keepScroll = true; return render(); }
      E.sud0 = F.sud; E.voc0 = F.voc;
    }
    E.step++; E.phase = "set"; render();
  },
  emdrSave() {
    const E = U.emdr, F = E.f; fixRanges();
    S.emdr.push({ t: Date.now(), target: (F.target || "").trim(), image: F.image || "", nc: pick(F.nc, F.ncPick), pc: pick(F.pc, F.pcPick), sud0: E.sud0, sud1: F.sudEnd, voc0: E.voc0, voc1: F.vocNow == null ? null : F.vocNow, sets: E.sets, notes: E.notes, learned: F.learned || "" });
    saveNow(); E.step = 6; render();
  }
};

/* ---------- guide context ---------- */
function contextFor(kind, ref) {
  const out = [], l = lastCheck(), b = S.checkins[0], A = id => (S.sessions[id] && S.sessions[id].answers) || {};
  out.push(`Name: ${S.profile.name || "not given"}. Started the program ${fmtDate(S.profile.startedAt)}. Stage: ${S.stage}.`);
  if (S.profile.why) out.push(`What brought them here, in their words: ${S.profile.why}`);
  out.push(`Areas in their plan: ${IW.trackOrder.filter(isOn).map(id => TRACK[id].name).join("; ")}.`);
  if (A("f1").goals) out.push(`Their goals: ${A("f1").goals}`);
  if (l) out.push(`Latest check-in (${fmtDate(l.t)}): PHQ-9 ${l.phq} (${IW.band("phq", l.phq)}), GAD-7 ${l.gad} (${IW.band("gad", l.gad)}).${b && b !== l ? ` At the start: PHQ-9 ${b.phq}, GAD-7 ${b.gad}.` : ""}${l.phqA && l.phqA[8] > 0 ? " They endorsed thoughts of being better off dead or of self-harm on this check-in; ask about it with care." : ""}`);
  const doneList = plan().filter(s => done(s.id)).map(s => s.t);
  if (doneList.length) out.push(`Sessions completed: ${doneList.join("; ")}.`);
  const L = S.life;
  if (L) {
    if (L.visionBoard.length) out.push(`On their vision board: ${L.visionBoard.map(v => v.title + (v.achieved ? " (achieved)" : "")).join("; ")}.`);
    if (L.shadowWork.quizHistory && L.shadowWork.quizHistory.length) { const top = Object.entries(L.shadowWork.archetypes).map(([k, v]) => [k, typeof v === "object" ? v.score : v]).sort((x, y) => y[1] - x[1]); out.push(`Jungian archetype assessment: strongest ${top.slice(0, 3).map(x => x[0]).join(", ")}; least expressed ${top.slice(-3).map(x => x[0]).join(", ")}.`); }
    if (L.shadowWork.reflections && L.shadowWork.reflections.length) out.push(`They have written ${L.shadowWork.reflections.length} shadow-work reflections.`);
  }
  if (S.emdr.length) out.push(`They have done ${S.emdr.length} self-guided EMDR-style session(s) in the app; the most recent target was "${S.emdr[S.emdr.length - 1].target}".`);
  const dump = (fields, answers) => fields.filter(f => f[1] !== "br").map(f => { const v = answers[f[0]]; return v == null || v === "" || (Array.isArray(v) && !v.length) ? null : `- ${f[2]} ${Array.isArray(v) ? v.join(", ") : v}`; }).filter(Boolean).join("\n");
  if (kind === "session" && SES[ref]) { const { s, t } = SES[ref]; out.push(`They opened this conversation from the session "${s.t}" (${t.name}; ${s.m}). What they wrote in it:\n${dump(s.f, A(ref)) || "(nothing yet)"}`); }
  if (kind === "thread") { const t = S.threads.find(x => x.id === ref); if (t) { const tool = IW.tools.find(x => x.id === t.tool); out.push(`They opened this conversation from the deep-work exercise "${tool.name}" (${tool.m})${t.title ? `, which they titled "${t.title}"` : ""}. What they wrote:\n${dump(tool.f, t.answers) || "(nothing yet)"}${t.notes.length ? "\nLater notes:\n" + t.notes.map(n => `- ${fmtDate(n.t)}: ${n.text}`).join("\n") : ""}`); } }
  return out.join("\n\n");
}

async function sendChat(chat, retry) {
  if (U.sending) return;
  const text = (U.draft || "").trim();
  if (!retry) { if (!text) return; chat.msgs.push({ role: "user", content: text }); if (!chat.title) chat.title = text.slice(0, 60); U.draft = ""; }
  chat.msgs = chat.msgs.filter(m => m.role !== "note");
  chat.t = Date.now(); U.sending = true; saveNow(); U.keepScroll = true; render(); toEnd();
  let acc = "";
  try {
    const { askGuide } = await import("./guide.js");
    const res = await askGuide({
      apiKey: S.settings.apiKey, model: MODEL, system: IW.guidePrompt + "\n\n" + chat.sys,
      messages: chat.msgs.map(m => ({ role: m.role, content: m.content })),
      onText: d => { acc += d; const box = $("#stream"); if (box) { box.innerHTML = paras(acc); toEnd(); } }
    });
    if (res.refused) chat.msgs.push({ role: "note", text: "The guide wasn't able to respond to that. Try putting it another way. If you're in crisis, use Help now at the top of the screen." });
    else chat.msgs.push({ role: "assistant", content: res.content });
  } catch (err) {
    chat.msgs.push({ role: "note", text: err.userMessage || "Something went wrong reaching the guide.", retry: true });
  }
  U.sending = false; saveNow();
  if (location.hash === "#/guide/" + chat.id) { U.keepScroll = true; render(); toEnd(); }
}
const toEnd = () => window.scrollTo(0, document.documentElement.scrollHeight);

/* ---------- actions ---------- */
const go = h => { if (location.hash === h) render(); else location.hash = h; };
const acts = {
  chip(el) { const p = el.dataset.path, cur = (get(p) || []).slice(), v = el.dataset.val, i = cur.indexOf(v); if (i < 0) cur.push(v); else cur.splice(i, 1); set(p, cur); el.setAttribute("aria-pressed", String(i < 0)); save(); },
  ans(el) { U.check[el.dataset.kind][+el.dataset.i] = +el.dataset.v; el.parentElement.querySelectorAll(".opt").forEach(b => b.setAttribute("aria-pressed", String(b === el))); },
  rerender() { saveNow(); render(); },
  intakeBack() { U.intake.step--; render(); },
  intakeNext() {
    const I = U.intake;
    if (I.step === 3 && !answered("phq") || I.step === 4 && !answered("gad")) { U.flash = "Please answer every question first."; U.keepScroll = true; return render(); }
    if (I.step < 5) { I.step++; return render(); }
    const phq = sum(U.check.phq), gad = sum(U.check.gad);
    S.profile = { name: I.name.trim(), why: I.why.trim(), startedAt: Date.now() };
    S.tracks = intakeTracks(phq, gad); S.stage = "program";
    S.checkins.push({ t: Date.now(), phqA: U.check.phq.slice(), gadA: U.check.gad.slice(), phq, gad });
    const risk = U.check.phq[8] > 0; U.check = { phq: [], gad: [] }; saveNow();
    if (risk) { U.fromCheck = true; go("#/crisis"); } else go("#/today");
  },
  saveCheck() {
    if (!answered("phq") || !answered("gad")) { U.flash = "Please answer every question first."; U.keepScroll = true; return render(); }
    const phq = sum(U.check.phq), gad = sum(U.check.gad), prev = lastCheck();
    S.checkins.push({ t: Date.now(), phqA: U.check.phq.slice(), gadA: U.check.gad.slice(), phq, gad });
    const risk = U.check.phq[8] > 0; U.check = { phq: [], gad: [] }; saveNow();
    const slipped = S.stage !== "program" && (phq >= 10 || gad >= 10);
    U.flash = slipped ? `Your scores have climbed. This is what your early-warning plan is for: open <a href="#/session/s2">Staying well, session 2</a> and follow your amber plan. You can also go back into the program below.`
      : prev && phq + gad < prev.phq + prev.gad ? "Saved. Lower than last time." : prev && phq + gad > prev.phq + prev.gad ? "Saved. Higher than last time. One check-in is a snapshot, so look at the trend." : "Saved.";
    if (risk) { U.fromCheck = true; go("#/crisis"); } else go("#/progress");
  },
  logMood() { const r = $('input[data-bind="U.mood.v"]'); const v = U.mood.v == null ? +r.value : U.mood.v; S.moods.push({ t: Date.now(), v, note: U.mood.note.trim() }); U.mood = { v: null, note: "" }; U.flash = `Logged: ${v} out of 10.`; saveNow(); render(); },
  practised(el) { const id = el.dataset.id; (S.practice[id] = S.practice[id] || []).push(dayKey()); saveNow(); U.keepScroll = true; render(); },
  toggleTrack(el) { const id = el.dataset.id; S.tracks[id] = !S.tracks[id]; saveNow(); U.keepScroll = true; render(); },
  completeSession(el) {
    const id = el.dataset.id; S.sessions[id].doneAt = Date.now(); saveNow();
    if (SES[id].s.graduation) return go("#/graduate");
    U.keepScroll = true; render();
  },
  graduate() { S.stage = "maintenance"; S.graduatedAt = Date.now(); saveNow(); U.flash = "You've graduated. Well done. Your next check-in is in two weeks."; go("#/today"); },
  finish() { S.stage = "graduated"; saveNow(); U.flash = "That's it. You're done."; go("#/today"); },
  resume() { S.stage = "program"; S.graduatedAt = null; saveNow(); go("#/program"); },
  rescueNext() {
    const R = U.rescue, f = IW.rescues.find(x => x.id === R.id), n = f.steps.length, r = $("#view input[type=range]");
    if (r && get(r.dataset.bind) == null) set(r.dataset.bind, +r.value);
    if (R.i === n) { S.rescues.push({ t: Date.now(), flow: R.id, before: R.before, after: R.after, a: R.a }); saveNow(); }
    R.i++; render();
  },
  rescueBack() { if (U.rescue.i > -1) U.rescue.i--; render(); },
  breathe(el) { startBreath(el.closest(".breather")); },
  newThread(el) { const t = { id: uid(), tool: el.dataset.tool, title: "", t: Date.now(), answers: {}, notes: [] }; S.threads.push(t); saveNow(); go("#/thread/" + t.id); },
  addNote(el) { const tx = U.note.trim(); if (!tx) return; S.threads[+el.dataset.ix].notes.push({ t: Date.now(), text: tx }); U.note = ""; saveNow(); U.keepScroll = true; render(); },
  delThread(el) { if (!confirm("Delete this piece of work? This can't be undone.")) return; S.threads.splice(+el.dataset.ix, 1); saveNow(); go("#/explore"); },
  newChat(el) {
    const kind = el.dataset.kind, ref = el.dataset.ref;
    let about = "", draft = "";
    if (kind === "session" && SES[ref]) { about = SES[ref].s.t; draft = `I've been working on the session “${about}” and I'd like to talk it through.`; }
    if (kind === "thread") { const t = S.threads.find(x => x.id === ref), tool = t && IW.tools.find(x => x.id === t.tool); if (t) { about = t.title || tool.name; draft = `I've been working on “${about}” and I want to go deeper into it.`; } }
    const c = { id: uid(), t: Date.now(), title: "", about, sys: contextFor(kind, ref), msgs: [] };
    S.chats.push(c); U.draft = draft; saveNow(); go("#/guide/" + c.id);
  },
  send(el) { const c = S.chats.find(x => x.id === el.dataset.id); if (c) sendChat(c, false); },
  retry(el) { const c = S.chats.find(x => x.id === el.dataset.id); if (c) sendChat(c, true); },
  export() {
    const copy = JSON.parse(JSON.stringify(S)); copy.settings.apiKey = "";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(copy, null, 1)], { type: "application/json" }));
    a.download = `inner-work-backup-${dayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  bg(el) { S.settings.bg = el.dataset.val; saveNow(); window.IWScene.set(S.settings.bg); U.keepScroll = true; render(); },
  reset() {
    if (!confirm("Erase everything you've written in Inner Work on this device?")) return;
    if (!confirm("This can't be undone. Erase it all?")) return;
    S = blank(); ensureLife(); saveNow(); U.intake = { step: 0, name: "", why: "", concerns: [] }; go("#/intake");
  }
};
function mergeSynthesis(d) {
  const u = d && (d.user || d); if (!u || (!u.visionBoard && !u.manifestationJournal && !u.shadowWork)) throw new Error("no entries");
  const L = ensureLife(), byDate = (x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0); let nv = 0, nj = 0, nr = 0;
  (u.visionBoard || []).forEach(v => { if (!L.visionBoard.some(x => x.id === v.id)) { L.visionBoard.push(v); nv++; } });
  (u.manifestationJournal || []).forEach(e => { if (e && e.date && !L.manifestationJournal.some(x => x.date === e.date)) { L.manifestationJournal.push(e); nj++; } });
  L.manifestationJournal.sort(byDate);
  const sw = u.shadowWork, m = L.shadowWork;
  if (sw) {
    const hadHistory = !!(m.quizHistory && m.quizHistory.length);
    m.reflections = m.reflections || []; (sw.reflections || []).forEach(r => { if (!m.reflections.some(x => x.date === r.date)) { m.reflections.push(r); nr++; } }); m.reflections.sort(byDate);
    m.completedExercises = [...new Set([...(m.completedExercises || []), ...(sw.completedExercises || [])])];
    m.quizHistory = [...(m.quizHistory || []), ...(sw.quizHistory || []).filter(h => !(m.quizHistory || []).some(x => x.date === h.date))].sort(byDate);
    if (!hadHistory && sw.archetypes) m.archetypes = sw.archetypes;
    if (!m.quizInProgress && sw.quizInProgress) m.quizInProgress = sw.quizInProgress;
    ["animaAnimus", "complexes", "dreams"].forEach(k => { if (sw[k] && (!m[k] || JSON.stringify(m[k]) === JSON.stringify(IW.life.defaultShadow[k]))) m[k] = sw[k]; });
    if (sw.currentPhase && m.currentPhase === IW.life.defaultShadow.currentPhase) m.currentPhase = sw.currentPhase;
  }
  saveNow();
  return `Brought in ${nv} vision${nv === 1 ? "" : "s"}, ${nj} journal entr${nj === 1 ? "y" : "ies"} and ${nr} shadow-work reflection${nr === 1 ? "" : "s"}.`;
}
const synthesisHere = () => { try { return localStorage.getItem("synthesisProgress"); } catch (e) { return null; } };
Object.assign(acts, moreActs, {
  synthesisLocal() { try { U.flash = mergeSynthesis(JSON.parse(synthesisHere())); } catch (e) { U.flash = "Couldn't read the Synthesis entries on this device."; } render(); },
  syncIn() {
    if (!sync.ready) { U.flash = "The sign-in service hasn't loaded. Check your connection and try again."; return render(); }
    const p = new window.firebase.auth.GoogleAuthProvider();
    sync.auth.signInWithPopup(p).catch(err => { if (err && (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment")) return sync.auth.signInWithRedirect(p); U.flash = "Sign-in didn't complete."; render(); });
  },
  syncOut() { if (confirm("Sign out? What you've written stays on this device.")) sync.auth.signOut(); }
});

/* ---------- saving across devices (optional) ----------
   Google sign-in and Firestore, in the same Firebase project Synthesis uses. Its rules let each
   person read and write only users/{their id}/…, so Inner Work keeps one private document there.
   Guide conversations and the API key are never uploaded. Newest change wins; before this device's
   copy is replaced, it is kept under "innerwork.v1.before-sync" in case you need it back. */
const FIREBASE = { apiKey: "AIzaSyC3seeTszL76em8Oe8huQk_uxLRpoSmgoY", authDomain: "synthesis-app-55932.firebaseapp.com", projectId: "synthesis-app-55932", storageBucket: "synthesis-app-55932.firebasestorage.app", messagingSenderId: "728962974566", appId: "1:728962974566:web:eb74e85bbaa87cfa65fea7" };
const sync = { user: null, status: "", timer: null, unsub: null, ready: false, auth: null, db: null };
const hasContent = s => !!(s && (s.profile || (s.life && (s.life.visionBoard.length || s.life.manifestationJournal.length || ((s.life.shadowWork || {}).reflections || []).length))));
const cloudRef = () => sync.db.collection("users").doc(sync.user.uid).collection("innerwork").doc("state");
const syncLine = () => sync.user ? `${esc(sync.user.email || "Signed in")}${sync.status ? " · " + esc(sync.status) : ""}` : sync.status === "unavailable" ? "Sign-in isn't available right now. Your writing is saved on this device." : "Saved on this device only";
const typing = () => { const el = document.activeElement; return !!el && /^(INPUT|TEXTAREA)$/.test(el.tagName); };
function setSync(text, redraw) {
  sync.status = text;
  if (redraw && location.hash.startsWith("#/settings") && !typing()) { U.keepScroll = true; render(); }
  else { const el = $("#sync-status"); if (el) el.innerHTML = syncLine(); }
}
function applyCloud(c, msg) {
  let data; try { data = JSON.parse(c.json); } catch (e) { return setSync("Sync error"); }
  if (hasContent(S)) { try { localStorage.setItem(KEY + ".before-sync", JSON.stringify(S)); } catch (e) { /* no room for the spare copy */ } }
  const chats = S.chats, apiKey = S.settings.apiKey;
  S = Object.assign(blank(), data); S.chats = chats; S.settings = Object.assign({ bls: "both" }, data.settings, { apiKey }); S._updatedAt = c.updatedAt; ensureLife(); window.IWScene.set(bgChoice());
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
  setSync(msg);
  if (!typing()) { U.keepScroll = true; render(); }
}
async function pushCloud() {
  if (!sync.user) return;
  try {
    const copy = clone(S); copy.chats = []; copy.settings = { bls: copy.settings.bls, bg: copy.settings.bg };
    await cloudRef().set({ json: JSON.stringify(copy), updatedAt: S._updatedAt || Date.now(), v: 1 });
    setSync("saved " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  } catch (e) { setSync("couldn't save online just now"); }
}
async function pullCloud() {
  try {
    const snap = await cloudRef().get();
    if (!snap.exists) { if (hasContent(S)) await pushCloud(); else setSync("ready"); return; }
    const c = snap.data(), cloudTs = c.updatedAt || 0, localTs = S._updatedAt || 0;
    if (!hasContent(S) || cloudTs > localTs) applyCloud(c, "up to date");
    else if (localTs > cloudTs) await pushCloud();
    else setSync("up to date");
  } catch (e) { setSync("couldn't reach your online copy"); }
}
const addScript = src => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
async function startSync() {
  try {
    const base = "https://www.gstatic.com/firebasejs/10.12.5/firebase-";
    await addScript(base + "app-compat.js"); await addScript(base + "auth-compat.js"); await addScript(base + "firestore-compat.js");
    const fb = window.firebase; if (!fb.apps.length) fb.initializeApp(FIREBASE);
    sync.auth = fb.auth(); sync.db = fb.firestore(); sync.ready = true;
    sync.auth.onAuthStateChanged(async u => {
      sync.user = u || null; if (sync.unsub) { sync.unsub(); sync.unsub = null; }
      if (!u) return setSync("", true);
      setSync("checking…", true); await pullCloud();
      sync.unsub = cloudRef().onSnapshot(snap => {
        if (!snap.exists || snap.metadata.hasPendingWrites) return;
        const c = snap.data(); if ((c.updatedAt || 0) > (S._updatedAt || 0)) applyCloud(c, "updated from another device");
      }, () => setSync("couldn't reach your online copy"));
    });
  } catch (e) { sync.status = "unavailable"; }
}
window.IWSync = { changed() { if (!sync.user) return; clearTimeout(sync.timer); sync.timer = setTimeout(pushCloud, 2000); } };
const changes = {
  synthesis(el) {
    const file = el.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { try { U.flash = mergeSynthesis(JSON.parse(rd.result)); } catch (e) { U.flash = "That file doesn't look like a Synthesis backup."; } render(); };
    rd.readAsText(file);
  },
  photo(el) {
    const file = el.files[0]; if (!file) return;
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1920 / Math.max(img.width, img.height)), cv = document.createElement("canvas");
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
      try { localStorage.setItem("innerwork.bg", cv.toDataURL("image/jpeg", 0.82)); S.settings.bg = "photo"; saveNow(); window.IWScene.set("photo"); U.flash = "Background changed."; }
      catch (e) { U.flash = "That photo is too large to keep in this browser. Try a smaller one."; }
      render();
    };
    img.onerror = () => { U.flash = "That file couldn't be read as a picture."; render(); };
    img.src = url;
  },
  import(el) {
    const file = el.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result); if (!d || d.v !== 1 || !Array.isArray(d.checkins)) throw new Error("not a backup");
        if (!confirm("Replace what's on this device with this backup?")) return;
        const key = S.settings.apiKey; S = Object.assign(blank(), d); S.settings = Object.assign({ bls: "both" }, d.settings, { apiKey: key }); ensureLife(); saveNow(); window.IWScene.set(bgChoice()); U.flash = "Backup restored."; go("#/today");
      } catch (e) { U.flash = "That file isn't an Inner Work backup."; render(); }
    };
    rd.readAsText(file);
  }
};

/* ---------- breathing timer ---------- */
let timers = [];
const stopTimers = () => { timers.forEach(clearInterval); timers = []; blsRun++; };
function startBreath(box) {
  if (box.dataset.on) return; box.dataset.on = "1";
  const orb = $(".orb", box), txt = $(".btxt", box), btn = $("button", box), total = +box.dataset.secs; let t = 0;
  btn.hidden = true;
  const tick = () => {
    if (t >= total) { clearInterval(iv); orb.className = "orb"; txt.textContent = "Done. Notice how you feel."; btn.hidden = false; btn.textContent = "Again"; delete box.dataset.on; return; }
    const ph = t % 10;
    if (ph === 0) { orb.className = "orb in"; } if (ph === 4) { orb.className = "orb out"; }
    txt.textContent = `${ph < 4 ? "Breathe in" : "Breathe out"} · ${total - t}s left`; t++;
  };
  tick(); const iv = setInterval(tick, 1000); timers.push(iv);
}

/* ---------- router ---------- */
const TAB = { vision: "vision", journal: "journal", shadow: "shadow", emdr: "explore", today: "today", rescue: "today", program: "program", session: "program", graduate: "progress", explore: "explore", thread: "explore", guide: "guide", progress: "progress", checkin: "progress" };
function render() {
  stopTimers();
  const parts = (location.hash.replace(/^#\/?/, "") || "today").split("/");
  let name = parts[0];
  if (!S.profile && name !== "crisis" && name !== "safety" && name !== "settings") name = "intake";
  if (S.profile && name === "intake") name = "today";
  const view = $("#view");
  view.innerHTML = (views[name] || views.today)(parts[1], parts[2]);
  document.body.dataset.view = views[name] ? name : "today";
  if (after[name]) after[name]();
  document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("on", a.dataset.tab === TAB[name]));
  $(".tabs").hidden = !S.profile;
  view.querySelectorAll("textarea").forEach(grow);
  if (U.keepScroll) U.keepScroll = false; else window.scrollTo(0, 0);
}

document.addEventListener("input", e => {
  const el = e.target.closest("[data-bind]"); if (!el) return;
  set(el.dataset.bind, el.dataset.num ? +el.value : el.value);
  if (el.type === "range") { el.classList.remove("unset"); el.nextElementSibling.textContent = el.value; }
  if (el.tagName === "TEXTAREA") grow(el);
  if (!el.dataset.bind.startsWith("U.")) save();
});
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el || el.disabled) return;
  const fn = acts[el.dataset.act]; if (fn) fn(el, e);
});
document.addEventListener("change", e => { const el = e.target.closest("[data-act-change]"); if (el) changes[el.dataset.actChange](el); });
document.addEventListener("keydown", e => { if (e.target.id === "composer" && e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); const b = $('[data-act="send"]'); if (b) b.click(); } });
addEventListener("hashchange", render);
window.IWScene.set(bgChoice());
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
if (location.protocol.startsWith("http")) startSync();
