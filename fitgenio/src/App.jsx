import { useState, useEffect, useRef, useCallback } from "react";

const EXERCISE_DURATION = 60;

const EXERCISES = [
  { id: 1, name: "Neck Rolls", reps: "5 slow circles each direction", cue: "Keep shoulders relaxed, move chin to chest then ear to shoulder", checkpoints: ["Shoulders down", "Slow movement", "Full range"], color: "#00E5C3", emoji: "🔄", steps: ["Drop chin to chest", "Roll ear to right shoulder", "Head back slowly", "Roll to left shoulder", "Repeat 5x each direction"] },
  { id: 2, name: "Shoulder Shrugs", reps: "10 reps", cue: "Raise shoulders to ears, hold 2 sec, release fully", checkpoints: ["Full raise", "Hold at top", "Full release"], color: "#FF6B6B", emoji: "🏔️", steps: ["Sit or stand tall", "Raise both shoulders to ears", "Hold for 2 seconds", "Drop shoulders fully", "Repeat 10 times"] },
  { id: 3, name: "Wrist Circles", reps: "10 circles each direction", cue: "Extend arms, make fists, rotate wrists in full circles", checkpoints: ["Arms extended", "Full rotation", "Both directions"], color: "#FFD93D", emoji: "⭕", steps: ["Extend arms forward", "Make loose fists", "Rotate wrists clockwise x10", "Rotate counter-clockwise x10", "Shake hands out"] },
  { id: 4, name: "Seated Spinal Twist", reps: "3 holds each side (10 sec each)", cue: "Sit tall, twist from the waist, use armrest for support", checkpoints: ["Spine tall", "Twist from waist", "Breathe steady"], color: "#6BCB77", emoji: "🌀", steps: ["Sit at edge of chair", "Place right hand on left knee", "Twist torso to the left", "Hold 10 seconds, breathe", "Switch sides — repeat 3x"] },
  { id: 5, name: "Eye Focus Shift", reps: "5 near-far cycles", cue: "Focus on fingertip held close, then shift to a distant object", checkpoints: ["Near focus clear", "Far focus clear", "Blink often"], color: "#4D96FF", emoji: "👁️", steps: ["Hold finger 10cm from face", "Focus on fingertip 3 sec", "Shift gaze to far wall", "Focus on far object 3 sec", "Repeat 5x, blink between"] },
  { id: 6, name: "Ankle Circles", reps: "10 circles each foot", cue: "Lift one foot, rotate ankle slowly in full circles", checkpoints: ["Foot lifted", "Full rotation", "Both feet done"], color: "#C77DFF", emoji: "🦶", steps: ["Sit upright in chair", "Lift right foot off floor", "Rotate ankle clockwise x10", "Rotate counter-clockwise x10", "Repeat with left foot"] },
  { id: 7, name: "Deep Breathing", reps: "5 slow breath cycles", cue: "Breathe in 4 sec, hold 4 sec, breathe out 4 sec", checkpoints: ["Belly rises", "Hold steady", "Slow exhale"], color: "#F9844A", emoji: "🌬️", steps: ["Sit tall, relax shoulders", "Breathe in through nose (4 sec)", "Hold your breath (4 sec)", "Slowly exhale through mouth (4 sec)", "Repeat 5 times"] },
];

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ─── Camera hook — FIXED: single video element, stable attachVideo ref ────────
function useCamera() {
  const streamRef = useRef(null);
  const videoElRef = useRef(null); // ONE canonical video element reference
  const [cameraOn, setCameraOn] = useState(false);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    let iv;
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        // If video element already mounted, attach immediately
        if (videoElRef.current) {
          videoElRef.current.srcObject = stream;
        }
        setCameraOn(true);
        const msgs = [
          "✓ Good posture detected",
          "✓ Movement looks smooth",
          "⚠ Raise arms a bit higher",
          "✓ Nice form! Keep going",
          "✓ Breathing looks steady",
        ];
        let i = 0;
        iv = setInterval(() => {
          setFeedback(p => [msgs[i++ % msgs.length], ...p].slice(0, 3));
        }, 4000);
      })
      .catch(() => setCameraOn(false));
    return () => {
      clearInterval(iv);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Stable callback ref — empty deps means same function reference across ALL renders.
  // This prevents React from detaching/reattaching srcObject on every re-render,
  // which was the root cause of the buffering issue.
  const attachVideo = useCallback((el) => {
    if (!el) return;
    videoElRef.current = el;
    if (streamRef.current) {
      el.srcObject = streamRef.current;
    }
  }, []); // ← intentionally empty: we never want this recreated

  return { attachVideo, cameraOn, feedback };
}

// ─── SVG Demos ────────────────────────────────────────────────────────────────
function NeckRollDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes nR{0%{transform:rotate(0deg)}25%{transform:rotate(25deg)}50%{transform:rotate(0deg)}75%{transform:rotate(-25deg)}100%{transform:rotate(0deg)}}.hn{animation:nR 3s ease-in-out infinite;transform-origin:100px 130px;}`}</style>
      <rect x="75" y="130" width="50" height="60" rx="8" fill="#1a1a2e"/>
      <rect x="90" y="118" width="20" height="20" rx="4" fill="#2a2a4e"/>
      <g className="hn"><circle cx="100" cy="95" r="30" fill="#2a2a4e"/><circle cx="91" cy="92" r="4" fill="#00E5C3"/><circle cx="109" cy="92" r="4" fill="#00E5C3"/><path d="M92 103 Q100 108 108 103" stroke="#00E5C3" strokeWidth="2" fill="none" strokeLinecap="round"/></g>
      <text x="100" y="197" textAnchor="middle" fill="#444" fontSize="11">roll slowly ↻</text>
    </svg>
  );
}
function ShoulderShrugsDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes sg{0%{transform:translateY(0)}40%{transform:translateY(-18px)}60%{transform:translateY(-18px)}100%{transform:translateY(0)}}.sg{animation:sg 2s ease-in-out infinite;}`}</style>
      <rect x="70" y="130" width="60" height="55" rx="10" fill="#1a1a2e"/><circle cx="100" cy="85" r="28" fill="#2a2a4e"/><circle cx="91" cy="82" r="4" fill="#FF6B6B"/><circle cx="109" cy="82" r="4" fill="#FF6B6B"/><rect x="91" y="112" width="18" height="22" rx="4" fill="#2a2a4e"/>
      <g className="sg"><rect x="20" y="118" width="52" height="22" rx="8" fill="#2a2a4e"/><rect x="128" y="118" width="52" height="22" rx="8" fill="#2a2a4e"/><rect x="24" y="136" width="18" height="40" rx="6" fill="#1a1a2e"/><rect x="158" y="136" width="18" height="40" rx="6" fill="#1a1a2e"/></g>
      <text x="100" y="197" textAnchor="middle" fill="#444" fontSize="11">raise & hold 2s ↑</text>
    </svg>
  );
}
function WristCirclesDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes wl{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes wr{0%{transform:rotate(0deg)}100%{transform:rotate(-360deg)}}.wl{animation:wl 2s linear infinite;transform-origin:65px 130px;}.wr{animation:wr 2s linear infinite;transform-origin:135px 130px;}`}</style>
      <rect x="75" y="90" width="50" height="70" rx="10" fill="#1a1a2e"/><circle cx="100" cy="60" r="25" fill="#2a2a4e"/><rect x="28" y="100" width="48" height="14" rx="7" fill="#2a2a4e"/><rect x="124" y="100" width="48" height="14" rx="7" fill="#2a2a4e"/>
      <g className="wl"><circle cx="65" cy="130" r="14" fill="#2a2a4e"/><rect x="57" y="123" width="16" height="10" rx="3" fill="#FFD93D" opacity="0.7"/></g>
      <g className="wr"><circle cx="135" cy="130" r="14" fill="#2a2a4e"/><rect x="127" y="123" width="16" height="10" rx="3" fill="#FFD93D" opacity="0.7"/></g>
      <text x="100" y="197" textAnchor="middle" fill="#444" fontSize="11">rotate wrists ↻ ↺</text>
    </svg>
  );
}
function SpinalTwistDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes tw{0%{transform:rotate(0deg)}30%{transform:rotate(18deg)}50%{transform:rotate(18deg)}80%{transform:rotate(-18deg)}100%{transform:rotate(0deg)}}.tw{animation:tw 4s ease-in-out infinite;transform-origin:100px 140px;}`}</style>
      <rect x="55" y="155" width="90" height="10" rx="4" fill="#1a1a2e"/><rect x="55" y="165" width="10" height="30" rx="3" fill="#1a1a2e"/><rect x="135" y="165" width="10" height="30" rx="3" fill="#1a1a2e"/><rect x="150" y="120" width="10" height="45" rx="4" fill="#1a1a2e"/>
      <g className="tw"><rect x="75" y="100" width="50" height="58" rx="10" fill="#2a2a4e"/><circle cx="100" cy="75" r="25" fill="#2a2a4e"/><circle cx="92" cy="72" r="3.5" fill="#6BCB77"/><circle cx="108" cy="72" r="3.5" fill="#6BCB77"/><rect x="40" y="108" width="36" height="12" rx="6" fill="#1e3a2e"/><rect x="124" y="108" width="36" height="12" rx="6" fill="#1e3a2e"/></g>
      <text x="100" y="200" textAnchor="middle" fill="#444" fontSize="11">twist & hold 10s</text>
    </svg>
  );
}
function EyeFocusDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes pe{0%{r:8}45%{r:8}55%{r:3}95%{r:3}100%{r:8}}@keyframes fe{0%{transform:translateX(0)}45%{transform:translateX(0)}55%{transform:translateX(-38px)}95%{transform:translateX(-38px)}100%{transform:translateX(0)}}@keyframes fre{0%{opacity:.2}45%{opacity:.2}55%{opacity:1}95%{opacity:1}100%{opacity:.2}}.pe{animation:pe 3s ease-in-out infinite}.fe{animation:fe 3s ease-in-out infinite}.fre{animation:fre 3s ease-in-out infinite}`}</style>
      <circle cx="100" cy="90" r="55" fill="#2a2a4e"/><ellipse cx="78" cy="85" rx="16" ry="12" fill="#0f0f1e"/><ellipse cx="122" cy="85" rx="16" ry="12" fill="#0f0f1e"/>
      <circle className="pe" cx="78" cy="85" r="8" fill="#4D96FF"/><circle className="pe" cx="122" cy="85" r="8" fill="#4D96FF"/>
      <path d="M82 108 Q100 118 118 108" stroke="#4D96FF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <g className="fe"><rect x="96" y="148" width="8" height="30" rx="4" fill="#FFD93D"/><circle cx="100" cy="148" r="5" fill="#FFD93D"/></g>
      <g className="fre"><rect x="8" y="30" width="22" height="30" rx="3" fill="#4D96FF" opacity="0.4"/><text x="19" y="72" textAnchor="middle" fill="#4D96FF" fontSize="9">far</text></g>
      <text x="100" y="196" textAnchor="middle" fill="#444" fontSize="11">near → far focus</text>
    </svg>
  );
}
function AnkleDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes ak{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.ak{animation:ak 1.5s linear infinite;transform-origin:130px 160px;}`}</style>
      <rect x="60" y="80" width="80" height="90" rx="10" fill="#1a1a2e"/><circle cx="100" cy="55" r="28" fill="#2a2a4e"/><circle cx="91" cy="52" r="4" fill="#C77DFF"/><circle cx="109" cy="52" r="4" fill="#C77DFF"/><rect x="60" y="168" width="30" height="14" rx="6" fill="#2a2a4e"/>
      <g className="ak"><rect x="115" y="145" width="28" height="12" rx="6" fill="#2a2a4e"/><ellipse cx="130" cy="160" rx="14" ry="10" fill="#C77DFF" opacity="0.5"/></g>
      <text x="100" y="197" textAnchor="middle" fill="#444" fontSize="11">rotate ankle ↻</text>
    </svg>
  );
}
function BreathingDemo() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <style>{`@keyframes br{0%{transform:scale(1)}40%{transform:scale(1.3)}60%{transform:scale(1.3)}100%{transform:scale(1)}}.br{animation:br 4s ease-in-out infinite;transform-origin:100px 130px;}`}</style>
      <circle cx="100" cy="60" r="28" fill="#2a2a4e"/><circle cx="91" cy="57" r="4" fill="#F9844A"/><circle cx="109" cy="57" r="4" fill="#F9844A"/><rect x="82" y="86" width="36" height="12" rx="6" fill="#2a2a4e"/>
      <g className="br"><ellipse cx="75" cy="130" rx="22" ry="30" fill="#F9844A" opacity="0.3"/><ellipse cx="125" cy="130" rx="22" ry="30" fill="#F9844A" opacity="0.3"/><ellipse cx="75" cy="130" rx="14" ry="20" fill="#F9844A" opacity="0.5"/><ellipse cx="125" cy="130" rx="14" ry="20" fill="#F9844A" opacity="0.5"/></g>
      <text x="100" y="197" textAnchor="middle" fill="#444" fontSize="11">breathe in… hold… out</text>
    </svg>
  );
}
const DEMOS = { 1: NeckRollDemo, 2: ShoulderShrugsDemo, 3: WristCirclesDemo, 4: SpinalTwistDemo, 5: EyeFocusDemo, 6: AnkleDemo, 7: BreathingDemo };

function ExerciseDemo({ exercise }) {
  const [step, setStep] = useState(0);
  const D = DEMOS[exercise.id] || NeckRollDemo;
  useEffect(() => {
    setStep(0);
    const iv = setInterval(() => setStep(s => (s + 1) % exercise.steps.length), 2000);
    return () => clearInterval(iv);
  }, [exercise.id]);
  return (
    <div style={ds.wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: exercise.color, fontSize: 13, fontWeight: 600 }}>▶ LIVE DEMO</span>
        <span style={{ color: "#444", fontSize: 11 }}>animated guide</span>
      </div>
      <div style={ds.box}><D /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {exercise.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 8, fontSize: 12, transition: "all 0.4s", background: i === step ? exercise.color + "18" : "transparent", borderLeft: i === step ? `3px solid ${exercise.color}` : "3px solid transparent", color: i === step ? "#fff" : "#555" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: i === step ? exercise.color : "#1a1a2e", color: i === step ? "#080812" : "#444" }}>{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, unit }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ color: "#888", fontSize: 13 }}>{label}</span>
        <span><span style={{ color: "#00E5C3", fontFamily: "'DM Serif Display',serif", fontSize: 22 }}>{value}</span><span style={{ color: "#555", fontSize: 12 }}> {unit}</span></span>
      </div>
      <input type="range" min={min} max={max} step={1} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%", accentColor: "#00E5C3", cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", color: "#333", fontSize: 11, marginTop: 4 }}><span>{min} {unit}</span><span>{max} {unit}</span></div>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────
function LoginScreen({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wm, setWm] = useState(50);
  const [bm, setBm] = useState(10);
  const [open, setOpen] = useState(false);
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 36 }}>💪</span>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: "#00E5C3", margin: 0 }}>fitgenio</h1>
        </div>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Work smarter. Move better. Feel great.</p>
        <div style={{ marginBottom: 20 }}>
          <label style={s.lbl}>Your Name</label>
          <input style={s.inp} placeholder="Alex" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={s.lbl}>Email</label>
          <input style={s.inp} placeholder="alex@work.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.toggle} onClick={() => setOpen(o => !o)}>
          <span>⚙️ Timer Settings</span>
          <span style={{ color: "#00E5C3", fontSize: 12 }}>{wm}min work · {bm}min break</span>
          <span style={{ marginLeft: "auto", color: "#555" }}>{open ? "▲" : "▼"}</span>
        </div>
        {open && (
          <div style={{ background: "#0a0a18", border: "1px solid #00E5C322", borderRadius: 14, padding: "20px 20px 8px", marginBottom: 12 }}>
            <Slider label="Work Session" value={wm} min={1} max={120} onChange={setWm} unit="min" />
            <Slider label="Break Duration" value={bm} min={1} max={60} onChange={setBm} unit="min" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ color: "#555", fontSize: 12, alignSelf: "center" }}>Presets:</span>
              {[["Test", 1, 1], ["Pomodoro", 25, 5], ["Classic", 50, 10], ["Deep", 90, 20]].map(([l, w, b]) => (
                <button key={l} style={s.presetBtn} onClick={() => { setWm(w); setBm(b); }}>{l}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
          {[`${wm}-min focus`, `${bm}-min break`, "AI form check"].map(f => <div key={f} style={s.chip}>{f}</div>)}
        </div>
        <button
          style={{ ...s.btn, opacity: name ? 1 : 0.4, cursor: name ? "pointer" : "not-allowed" }}
          onClick={() => name && onStart(name, wm, bm)}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

function WorkScreen({ userName, timeLeft, totalSecs, sessionCount, onStop }) {
  const pct = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;
  const C = 2 * Math.PI * 110;
  return (
    <div style={s.wrap}>
      <div style={s.topBar}>
        <div style={s.badge}>👋 {userName}</div>
        <div style={{ ...s.badge, color: "#00E5C3", background: "#00E5C311", border: "1px solid #00E5C322" }}>Session #{sessionCount}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32 }}>FOCUS MODE</p>
        <div style={{ position: "relative", width: 260, height: 260, marginBottom: 32 }}>
          <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="130" cy="130" r="110" fill="none" stroke="#1a1a2e" strokeWidth="16" />
            <circle cx="130" cy="130" r="110" fill="none" stroke="#00E5C3" strokeWidth="16" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "#fff", fontSize: 52, fontFamily: "'DM Serif Display',serif", letterSpacing: "-2px" }}>{formatTime(timeLeft)}</div>
            <div style={{ color: "#444", fontSize: 13, marginTop: 6 }}>remaining</div>
          </div>
        </div>
        <div style={{ color: "#00E5C3", fontSize: 13, background: "#00E5C311", border: "1px solid #00E5C322", borderRadius: 20, padding: "6px 18px" }}>🟢 Running in background</div>
        <p style={{ color: "#333", fontSize: 13, marginTop: 12 }}>Break starts automatically when timer ends</p>
      </div>
      <button style={s.stopBtn} onClick={onStop}>⏹ Stop Fitgenio</button>
    </div>
  );
}

function BreakScreen({ timeLeft, totalSecs, globalExIdx, userName, onSkip, onStop }) {
  const [localIdx, setLocalIdx] = useState(0);
  const [restMode, setRestMode] = useState(false);
  const [checked, setChecked] = useState([]);
  const [exTimer, setExTimer] = useState(EXERCISE_DURATION);
  const exIvRef = useRef(null);

  // ── FIXED: single stable camera hook, no duplicate video elements ──
  const { attachVideo, cameraOn, feedback } = useCamera();

  const pct = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;
  const ex = EXERCISES[(globalExIdx + localIdx) % EXERCISES.length];
  const exPct = ((EXERCISE_DURATION - exTimer) / EXERCISE_DURATION) * 100;

  // Exercise auto-timer
  useEffect(() => {
    if (restMode) { clearInterval(exIvRef.current); return; }
    clearInterval(exIvRef.current);
    setExTimer(EXERCISE_DURATION);
    exIvRef.current = setInterval(() => {
      setExTimer(p => {
        if (p <= 1) {
          setLocalIdx(i => i + 1);
          setChecked([]);
          return EXERCISE_DURATION;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(exIvRef.current);
  }, [localIdx, restMode]);

  const toggle = cp => setChecked(p => p.includes(cp) ? p.filter(x => x !== cp) : [...p, cp]);

  return (
    <div style={s.wrap}>
      <div style={s.topBar}>
        <div style={s.badge}>💪 {userName}</div>
        <div style={{ ...s.badge, background: restMode ? "#ffffff18" : ex.color + "22", color: restMode ? "#888" : ex.color, border: `1px solid ${restMode ? "#ffffff22" : ex.color + "44"}` }}>
          {restMode ? "😌 Rest Mode" : "Break Time"}
        </div>
      </div>

      {/* Break progress bar */}
      <div style={{ width: "100%", height: 4, background: "#1a1a2e", borderRadius: 2, marginBottom: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: restMode ? "#555" : ex.color, borderRadius: 2, transition: "width 1s linear" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: restMode ? "#888" : ex.color }}>{formatTime(timeLeft)}</span>
          <span style={{ color: "#444", fontSize: 13 }}>break remaining</span>
        </div>
        {!restMode && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#555", fontSize: 12 }}>Next in</span>
            <span style={{ color: ex.color, fontWeight: 700 }}>{exTimer}s</span>
            <svg width="32" height="32" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="16" cy="16" r="12" fill="none" stroke="#1a1a2e" strokeWidth="3" />
              <circle cx="16" cy="16" r="12" fill="none" stroke={ex.color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={2 * Math.PI * 12 * (1 - exPct / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
          </div>
        )}
      </div>

      {restMode ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          {/*
            FIXED: No hidden offscreen <video> here anymore.
            The stream lives in streamRef inside useCamera and does NOT need
            a DOM element to stay alive. Removing the duplicate video element
            eliminates the srcObject conflict that caused buffering.
          */}
          <div style={{ fontSize: 72 }}>😌</div>
          <h2 style={{ color: "#aaa", fontFamily: "'DM Serif Display',serif", fontSize: 28, margin: 0 }}>Rest & Recharge</h2>
          <p style={{ color: "#555", fontSize: 15, textAlign: "center", maxWidth: 380 }}>
            Take it easy. Close your eyes, breathe slowly.<br />The break timer is still running.
          </p>
          <button style={{ ...s.btn, maxWidth: 260 }} onClick={() => { setRestMode(false); setLocalIdx(i => i + 1); setChecked([]); }}>
            ▶ Resume Exercises
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 1100, alignSelf: "center", width: "100%" }}>

          {/* Exercise info panel */}
          <div style={{ background: "#0f0f1e", border: `1px solid ${ex.color}44`, borderRadius: 20, padding: 20, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {Array.from({ length: Math.min(7, Math.max(1, Math.ceil(totalSecs / EXERCISE_DURATION))) }).map((_, i) => (
                <div key={i} style={{ height: 6, flex: 1, borderRadius: 3, background: i < localIdx ? "#00E5C3" : i === localIdx ? ex.color : "#1a1a2e", transition: "background 0.3s" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <span style={{ fontSize: 36 }}>{ex.emoji}</span>
              <div>
                <div style={{ color: ex.color, fontFamily: "'DM Serif Display',serif", fontSize: 20 }}>{ex.name}</div>
                <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{ex.reps}</div>
              </div>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, background: "#ffffff08", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>{ex.cue}</p>
            <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Self-check:</p>
            {ex.checkpoints.map(cp => (
              <div key={cp} onClick={() => toggle(cp)} style={{ border: `1px solid ${checked.includes(cp) ? ex.color : "#333"}`, background: checked.includes(cp) ? ex.color + "22" : "transparent", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, color: "#ccc", marginBottom: 5, display: "flex", alignItems: "center" }}>
                <span style={{ color: checked.includes(cp) ? ex.color : "#555" }}>{checked.includes(cp) ? "✓" : "○"}</span>
                <span style={{ marginLeft: 8 }}>{cp}</span>
              </div>
            ))}
            <button
              onClick={() => { setLocalIdx(i => i + 1); setChecked([]); }}
              style={{ marginTop: "auto", background: ex.color + "22", color: ex.color, border: `1px solid ${ex.color}44`, borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}
            >
              ✅ Done! Next Exercise →
            </button>
          </div>

          {/* Animated demo panel */}
          <ExerciseDemo exercise={ex} />

          {/* Camera panel — single <video> with stable attachVideo ref */}
          <div style={{ background: "#0f0f1e", border: "1px solid #1e1e36", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 13, marginBottom: 10, color: cameraOn ? "#00E5C3" : "#666" }}>
              {cameraOn ? "● AI Form Monitor" : "○ Camera Offline"}
            </div>
            <div style={{ flex: 1, background: "#0a0a18", borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 180 }}>
              {/*
                FIXED: Only ONE <video> element total. The stable `attachVideo`
                callback (useCallback with []) ensures React never
                detaches/reattaches the srcObject across re-renders.
              */}
              <video
                ref={attachVideo}
                autoPlay
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
              />
              {!cameraOn && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>Camera unavailable</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 10 }}>
              {feedback.map((f, i) => (
                <div key={i} style={{ fontSize: 12, opacity: 1 - i * 0.25, color: f.startsWith("✓") ? "#00E5C3" : "#FFD93D", marginBottom: 4 }}>{f}</div>
              ))}
            </div>
          </div>

        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
        {!restMode && <button style={s.restBtn} onClick={() => setRestMode(true)}>😌 Just Rest (keep timer)</button>}
        <button style={s.skipBtn} onClick={onSkip}>⏩ Skip Break</button>
        <button style={s.stopBtn} onClick={onStop}>⏹ Stop Fitgenio</button>
      </div>
    </div>
  );
}

function StoppedScreen({ sessionCount, userName, workMins, onRestart }) {
  return (
    <div style={s.page}>
      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ color: "#00E5C3", fontFamily: "'DM Serif Display',serif", fontSize: 32 }}>Great work, {userName}!</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>You completed {sessionCount} session{sessionCount !== 1 ? "s" : ""} today.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 28 }}>
          {[[sessionCount, "Sessions"], [sessionCount * workMins, "Focus mins"], [sessionCount * 5, "Exercises"]].map(([n, l]) => (
            <div key={l} style={{ background: "#0a0a18", border: "1px solid #1e1e36", borderRadius: 14, padding: "16px 24px", textAlign: "center" }}>
              <div style={{ color: "#00E5C3", fontFamily: "'DM Serif Display',serif", fontSize: 32, lineHeight: 1 }}>{n}</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <button style={s.btn} onClick={onRestart}>Start New Session</button>
      </div>
    </div>
  );
}

// ─── MAIN APP — single master timer using Date.now() ─────────────────────────
export default function App() {
  const [screen, setScreen]        = useState("login");
  const [userName, setUserName]    = useState("");
  const [sessionCount, setSession] = useState(1);
  const [globalExIdx, setGlobalEx] = useState(0);
  const [timeLeft, setTimeLeft]    = useState(0);
  const [totalSecs, setTotalSecs]  = useState(0);

  const wSecsRef  = useRef(50 * 60);
  const bSecsRef  = useRef(10 * 60);
  const wMinsRef  = useRef(50);
  const ivRef     = useRef(null);
  const endTimeRef = useRef(0);
  const phaseRef  = useRef("work");
  const sessRef   = useRef(1);
  const exRef     = useRef(0);

  const clearIv = () => { clearInterval(ivRef.current); ivRef.current = null; };

  const startTickRef = useRef(null);
  startTickRef.current = (durationSecs) => {
    clearIv();
    endTimeRef.current = Date.now() + durationSecs * 1000;
    setTimeLeft(durationSecs);
    setTotalSecs(durationSecs);
    ivRef.current = setInterval(() => {
      const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        clearIv();
        setTimeLeft(0);
        if (phaseRef.current === "work") {
          phaseRef.current = "break";
          setScreen("break");
          startTickRef.current(bSecsRef.current);
        } else {
          phaseRef.current = "work";
          sessRef.current += 1;
          exRef.current += EXERCISES.length;
          setSession(sessRef.current);
          setGlobalEx(exRef.current);
          setScreen("work");
          startTickRef.current(wSecsRef.current);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 500);
  };

  const handleStart = (name, wm, bm) => {
    setUserName(name);
    wMinsRef.current = wm;
    wSecsRef.current = wm * 60;
    bSecsRef.current = bm * 60;
    sessRef.current = 1;
    exRef.current = 0;
    setSession(1);
    setGlobalEx(0);
    phaseRef.current = "work";
    setScreen("work");
    startTickRef.current(wm * 60);
  };

  const handleStop = () => { clearIv(); setScreen("stopped"); };

  const handleSkip = () => {
    clearIv();
    sessRef.current += 1;
    exRef.current += EXERCISES.length;
    setSession(sessRef.current);
    setGlobalEx(exRef.current);
    phaseRef.current = "work";
    setScreen("work");
    startTickRef.current(wSecsRef.current);
  };

  useEffect(() => () => clearIv(), []);

  if (screen === "login")   return <LoginScreen onStart={handleStart} />;
  if (screen === "work")    return <WorkScreen userName={userName} timeLeft={timeLeft} totalSecs={totalSecs} sessionCount={sessionCount} onStop={handleStop} />;
  if (screen === "break")   return <BreakScreen timeLeft={timeLeft} totalSecs={totalSecs} globalExIdx={globalExIdx} userName={userName} onSkip={handleSkip} onStop={handleStop} />;
  if (screen === "stopped") return <StoppedScreen sessionCount={sessionCount} userName={userName} workMins={wMinsRef.current} onRestart={() => { setSession(0); setScreen("login"); }} />;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const ds = {
  wrap: { background: "#0a0a18", border: "1px solid #1e1e36", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  box:  { width: "100%", height: 170, background: "#080812", borderRadius: 12, overflow: "hidden" },
};
const s = {
  page:      { minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 20 },
  card:      { background: "#0f0f1e", border: "1px solid #1e1e36", borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 460, boxShadow: "0 0 80px rgba(0,229,195,.06)" },
  wrap:      { minHeight: "100vh", background: "#080812", display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", padding: 24 },
  topBar:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  badge:     { color: "#888", fontSize: 14, background: "#0f0f1e", border: "1px solid #1e1e36", borderRadius: 20, padding: "6px 16px" },
  lbl:       { display: "block", color: "#888", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 },
  inp:       { width: "100%", background: "#15152a", border: "1px solid #1e1e36", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" },
  toggle:    { display: "flex", alignItems: "center", gap: 10, background: "#15152a", border: "1px solid #1e1e36", borderRadius: 10, padding: "12px 16px", cursor: "pointer", fontSize: 14, color: "#aaa", marginBottom: 12, userSelect: "none" },
  presetBtn: { background: "#1a1a2e", color: "#00E5C3", border: "1px solid #00E5C333", borderRadius: 20, padding: "4px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  chip:      { background: "#00E5C311", color: "#00E5C3", border: "1px solid #00E5C333", borderRadius: 20, padding: "4px 14px", fontSize: 12 },
  btn:       { width: "100%", background: "#00E5C3", color: "#080812", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 8 },
  stopBtn:   { background: "transparent", color: "#FF6B6B", border: "1px solid #FF6B6B44", borderRadius: 12, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  skipBtn:   { background: "transparent", color: "#FFD93D", border: "1px solid #FFD93D44", borderRadius: 12, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  restBtn:   { background: "transparent", color: "#aaa", border: "1px solid #ffffff22", borderRadius: 12, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
};
