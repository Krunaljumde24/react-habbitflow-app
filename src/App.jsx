/**
 * HabitFlow — Full-Stack Habit Tracker
 * Frontend: React + Recharts + Lucide Icons
 * Persistence: localStorage (swap fetch() calls for real API in production)
 *
 * Architecture:
 *   App → AuthPage | MainLayout → Dashboard | HabitsPage | CalendarPage | AnalyticsPage | SettingsPage
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Home, List, Calendar, BarChart2, Settings,
  Plus, Check, X, Flame, Trash2, Edit2,
  Sun, Moon, LogOut, ChevronLeft, ChevronRight,
  Bell, Download, Trophy,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: "health", label: "Health", emoji: "❤️", color: "#ef4444" },
  { id: "fitness", label: "Fitness", emoji: "💪", color: "#f97316" },
  { id: "study", label: "Study", emoji: "📚", color: "#3b82f6" },
  { id: "mindfulness", label: "Mindfulness", emoji: "🧘", color: "#8b5cf6" },
  { id: "productivity", label: "Productivity", emoji: "⚡", color: "#eab308" },
  { id: "social", label: "Social", emoji: "👥", color: "#ec4899" },
  { id: "finance", label: "Finance", emoji: "💰", color: "#22c55e" },
  { id: "other", label: "Other", emoji: "✨", color: "#94a3b8" },
];

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════ */

/** Format a Date to "YYYY-MM-DD" in local time */
const fmtDate = (d = new Date()) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

/** Today's date string */
const todayStr = () => fmtDate(new Date());

/** Tiny unique id */
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Simple password hashing (use bcrypt on real backend) */
const hashPw = (pw) => btoa(encodeURIComponent(pw + "__hf_salt__"));

/** localStorage helpers */
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem(k),
};

/**
 * Returns which weekday indices (Mon=0…Sun=6) a habit is due on.
 */
const getHabitWeekdays = (habit) => {
  switch (habit.frequency) {
    case "daily": return [0, 1, 2, 3, 4, 5, 6];
    case "weekdays": return [0, 1, 2, 3, 4];
    case "weekends": return [5, 6];
    case "custom": return habit.customDays ?? [];
    default: return [0, 1, 2, 3, 4, 5, 6];
  }
};

/** Is this habit due on a given dateStr? */
const isHabitDue = (habit, dateStr) => {
  if (habit.startDate > dateStr) return false;
  const jsDay = new Date(dateStr + "T12:00:00").getDay(); // 0=Sun
  const monFirst = jsDay === 0 ? 6 : jsDay - 1;           // Mon=0..Sun=6
  return getHabitWeekdays(habit).includes(monFirst);
};

/**
 * Calculate current & longest streak for a habit.
 * Rule: if a day is missed the streak resets to 0.
 */
const calcStreak = (habitId, logs) => {
  const doneDates = logs
    .filter((l) => l.habitId === habitId && l.completed)
    .map((l) => l.date)
    .sort((a, b) => (a > b ? -1 : 1)); // newest first

  if (!doneDates.length) return { current: 0, longest: 0 };

  const t = todayStr();
  const yd = fmtDate(new Date(Date.now() - 864e5));

  // Current streak: must start from today or yesterday
  let current = 0;
  if (doneDates[0] === t || doneDates[0] === yd) {
    current = 1;
    let ref = new Date(doneDates[0] + "T12:00:00");
    for (let i = 1; i < doneDates.length; i++) {
      ref.setDate(ref.getDate() - 1);
      if (doneDates[i] === fmtDate(ref)) { current++; }
      else break;
    }
  }

  // Longest streak (over all history)
  let longest = current, temp = 1;
  for (let i = 1; i < doneDates.length; i++) {
    const prev = new Date(doneDates[i - 1] + "T12:00:00");
    prev.setDate(prev.getDate() - 1);
    if (doneDates[i] === fmtDate(prev)) {
      temp++;
      if (temp > longest) longest = temp;
    } else {
      temp = 1;
    }
  }

  return { current, longest };
};

/* ═══════════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════════ */
const getTheme = (dark) => ({
  bg: dark ? "#0d1117" : "#f0f2f5",
  bgCard: dark ? "#161b22" : "#ffffff",
  bgHover: dark ? "#21262d" : "#f6f8fa",
  bgInput: dark ? "#0d1117" : "#f6f8fa",
  border: dark ? "#30363d" : "#d0d7de",
  text: dark ? "#e6edf3" : "#1c2128",
  textSub: dark ? "#8b949e" : "#656d76",
  accent: "#7c3aed",
  accentAlt: "#6d28d9",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.08)",
});

/* ═══════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
═══════════════════════════════════════════════════════════════ */

const Btn = ({ children, onClick, variant = "ghost", style = {}, disabled, ...rest }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "none",
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    fontSize: "14px", fontWeight: "600", transition: "all 0.18s", ...style,
  };
  const variants = {
    primary: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", boxShadow: "0 4px 14px rgba(124,58,237,0.35)" },
    danger: { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
    ghost: { background: "transparent", color: "#8b949e", border: "1px solid #30363d" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...(variants[variant] ?? {}), ...style }} {...rest}>{children}</button>;
};

const Field = ({ label, children, style = {} }) => (
  <div style={{ marginBottom: "16px", ...style }}>
    {label && <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#8b949e", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
    {children}
  </div>
);

const Input = ({ theme, ...props }) => (
  <input
    style={{ width: "100%", padding: "11px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
    onBlur={(e) => (e.target.style.borderColor = theme.border)}
    {...props}
  />
);

const Tag = ({ color, children }) => (
  <span style={{ fontSize: "11px", fontWeight: "700", color, background: `${color}20`, padding: "2px 9px", borderRadius: "99px" }}>{children}</span>
);

const Card = ({ children, theme, style = {} }) => (
  <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", ...style }}>{children}</div>
);

/* ═══════════════════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════════════════ */
function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    setError(""); setLoading(true);
    // Simulated async API call — replace with fetch("/api/auth/...") in production
    setTimeout(() => {
      const users = store.get("users") || [];
      if (isLogin) {
        const u = users.find((u) => u.email === form.email && u.passwordHash === hashPw(form.password));
        if (!u) { setError("Invalid email or password."); setLoading(false); return; }
        const { passwordHash: _, ...safe } = u;
        store.set("currentUser", safe);
        onAuth(safe);
      } else {
        if (!form.name || !form.email || !form.password) { setError("All fields are required."); setLoading(false); return; }
        if (users.find((u) => u.email === form.email)) { setError("Email already in use."); setLoading(false); return; }
        const nu = { id: uid(), name: form.name, email: form.email, passwordHash: hashPw(form.password), createdAt: new Date().toISOString() };
        store.set("users", [...users, nu]);
        const { passwordHash: _, ...safe } = nu;
        store.set("currentUser", safe);
        onAuth(safe);
      }
      setLoading(false);
    }, 450);
  };

  const inp = {
    style: { width: "100%", padding: "12px 14px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "10px", color: "#e6edf3", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    onFocus: (e) => (e.target.style.borderColor = "#7c3aed"),
    onBlur: (e) => (e.target.style.borderColor = "#30363d"),
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#0d1117 0%,#161b22 60%,#0d1117 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: '"Plus Jakarta Sans",system-ui,sans-serif' }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", right: "-15%", width: "600px", height: "600px", background: "radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "68px", height: "68px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "20px", marginBottom: "16px", boxShadow: "0 12px 40px rgba(124,58,237,.45)", fontSize: "30px" }}>🔥</div>
          <h1 style={{ color: "#e6edf3", fontSize: "30px", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-0.8px" }}>HabitFlow</h1>
          <p style={{ color: "#8b949e", fontSize: "15px", margin: 0 }}>Build habits that last a lifetime.</p>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#0d1117", borderRadius: "12px", padding: "4px", marginBottom: "28px" }}>
            {["Login", "Sign Up"].map((tab, i) => (
              <button key={tab} onClick={() => { setIsLogin(i === 0); setError(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", fontFamily: "inherit", transition: "all 0.2s", background: (i === 0) === isLogin ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent", color: (i === 0) === isLogin ? "#fff" : "#8b949e" }}>
                {tab}
              </button>
            ))}
          </div>

          {!isLogin && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
              <input {...inp} value={form.name} onChange={handle("name")} placeholder="Jane Doe" type="text" />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
            <input {...inp} value={form.email} onChange={handle("email")} placeholder="you@example.com" type="email" />
          </div>

          <div style={{ marginBottom: error ? "14px" : "24px" }}>
            <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
            <input {...inp} value={form.password} onChange={handle("password")} placeholder="••••••••" type="password" onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", padding: "10px 14px", background: "rgba(239,68,68,.1)", borderRadius: "8px", border: "1px solid rgba(239,68,68,.25)" }}>{error}</div>}

          <button onClick={submit} disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "#374151" : "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: "0 6px 20px rgba(124,58,237,.4)", letterSpacing: "0.01em" }}>
            {loading ? "Please wait…" : isLogin ? "Sign In →" : "Create Account →"}
          </button>

          {/* Demo creds */}
          <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(124,58,237,.1)", borderRadius: "10px", border: "1px solid rgba(124,58,237,.25)" }}>
            <p style={{ color: "#8b5cf6", fontSize: "11px", fontWeight: "700", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>🔑 Demo Account</p>
            <p style={{ color: "#c4b5fd", fontSize: "13px", margin: 0 }}>demo@habitflow.com · demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HABIT MODAL (Create / Edit)
═══════════════════════════════════════════════════════════════ */
function HabitModal({ habit, onSave, onClose, theme }) {
  const [form, setForm] = useState({
    name: habit?.name ?? "",
    description: habit?.description ?? "",
    category: habit?.category ?? "health",
    frequency: habit?.frequency ?? "daily",
    customDays: habit?.customDays ?? [],
    startDate: habit?.startDate ?? todayStr(),
    reminder: habit?.reminder ?? "",
  });
  const [err, setErr] = useState("");

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const toggleDay = (i) => setForm((f) => ({
    ...f, customDays: f.customDays.includes(i) ? f.customDays.filter((d) => d !== i) : [...f.customDays, i],
  }));

  const save = () => {
    if (!form.name.trim()) { setErr("Habit name is required."); return; }
    onSave(form);
  };

  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(6px)" };
  const modal = { background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "500px", maxHeight: "92vh", overflowY: "auto", boxShadow: theme.shadow };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: "20px", fontWeight: "800" }}>{habit ? "Edit Habit" : "New Habit ✨"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSub, padding: "4px", display: "flex" }}><X size={20} /></button>
        </div>

        {/* Name */}
        <Field label="Habit Name *">
          <Input theme={theme} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Morning Run, Read 30 mins…" autoFocus />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional notes…" rows={2}
            style={{ width: "100%", padding: "11px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "#7c3aed")} onBlur={(e) => (e.target.style.borderColor = theme.border)}
          />
        </Field>

        {/* Category */}
        <Field label="Category">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => set("category", cat.id)}
                style={{ padding: "10px 4px", background: form.category === cat.id ? `${cat.color}22` : theme.bgInput, border: `1px solid ${form.category === cat.id ? cat.color : theme.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "all 0.15s" }}>
                <span style={{ fontSize: "18px" }}>{cat.emoji}</span>
                <span style={{ fontSize: "10px", fontWeight: "700", color: form.category === cat.id ? cat.color : theme.textSub }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </Field>

        {/* Frequency */}
        <Field label="Frequency">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["daily", "weekdays", "weekends", "custom"].map((f) => (
              <button key={f} onClick={() => set("frequency", f)}
                style={{ padding: "9px 16px", background: form.frequency === f ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : theme.bgInput, border: `1px solid ${form.frequency === f ? "#7c3aed" : theme.border}`, borderRadius: "8px", color: form.frequency === f ? "#fff" : theme.textSub, cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", transition: "all 0.15s", textTransform: "capitalize" }}>
                {f}
              </button>
            ))}
          </div>
          {form.frequency === "custom" && (
            <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
              {WEEKDAY_LABELS.map((d, i) => (
                <button key={d} onClick={() => toggleDay(i)}
                  style={{ flex: 1, padding: "9px 0", background: form.customDays.includes(i) ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : theme.bgInput, border: `1px solid ${form.customDays.includes(i) ? "#7c3aed" : theme.border}`, borderRadius: "7px", color: form.customDays.includes(i) ? "#fff" : theme.textSub, cursor: "pointer", fontSize: "11px", fontWeight: "800", fontFamily: "inherit" }}>
                  {d}
                </button>
              ))}
            </div>
          )}
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {/* Start Date */}
          <Field label="Start Date">
            <Input theme={theme} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          {/* Reminder */}
          <Field label="Reminder (optional)">
            <Input theme={theme} type="time" value={form.reminder} onChange={(e) => set("reminder", e.target.value)} />
          </Field>
        </div>

        {err && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", padding: "10px 12px", background: "rgba(239,68,68,.1)", borderRadius: "8px" }}>{err}</div>}

        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.textSub, cursor: "pointer", fontWeight: "600", fontFamily: "inherit", fontSize: "14px" }}>Cancel</button>
          <button onClick={save} style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", cursor: "pointer", fontWeight: "800", fontFamily: "inherit", fontSize: "14px", boxShadow: "0 6px 20px rgba(124,58,237,.35)" }}>
            {habit ? "Save Changes" : "Create Habit"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HABIT ROW CARD
═══════════════════════════════════════════════════════════════ */
function HabitRow({ habit, done, streak, onToggle, onEdit, onDelete, theme }) {
  const cat = CATEGORIES.find((c) => c.id === habit.category) ?? CATEGORIES[7];
  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${done ? cat.color + "44" : theme.border}`, borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}>
      {/* Toggle */}
      <button onClick={onToggle}
        style={{ width: "30px", height: "30px", borderRadius: "50%", border: `2px solid ${done ? cat.color : theme.border}`, background: done ? cat.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
        {done && <Check size={14} color="#fff" strokeWidth={3} />}
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ fontSize: "16px" }}>{cat.emoji}</span>
          <span style={{ color: done ? theme.textSub : theme.text, fontSize: "15px", fontWeight: "700", textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{habit.name}</span>
        </div>
        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" }}>
          <Tag color={cat.color}>{cat.label}</Tag>
          <Tag color={theme.textSub} style={{ textTransform: "capitalize" }}>{habit.frequency}</Tag>
          {streak.current > 0 && <span style={{ fontSize: "11px", color: "#f97316", fontWeight: "700" }}>🔥 {streak.current}d</span>}
        </div>
      </div>

      {/* Actions */}
      {onEdit && (
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={onEdit} style={{ padding: "7px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", color: theme.textSub, display: "flex" }}><Edit2 size={14} /></button>
          <button onClick={onDelete} style={{ padding: "7px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "8px", cursor: "pointer", color: "#ef4444", display: "flex" }}><Trash2 size={14} /></button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function Dashboard({ habits, logs, user, onToggle, onAddHabit, theme }) {
  const today = todayStr();
  const dueToday = habits.filter((h) => isHabitDue(h, today));
  const doneToday = dueToday.filter((h) => logs.some((l) => l.habitId === h.id && l.date === today && l.completed));
  const rate = dueToday.length ? Math.round((doneToday.length / dueToday.length) * 100) : 0;
  const totalStreak = habits.reduce((s, h) => s + calcStreak(h.id, logs).current, 0);

  const now = new Date();
  const hr = now.getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      {/* Greeting */}
      <p style={{ color: theme.textSub, fontSize: "14px", margin: "0 0 4px" }}>{dateLabel}</p>
      <h1 style={{ color: theme.text, fontSize: "28px", fontWeight: "800", margin: "0 0 28px", letterSpacing: "-0.5px" }}>
        {greet}, {user.name.split(" ")[0]} 👋
      </h1>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { icon: "✅", val: `${doneToday.length}/${dueToday.length}`, label: "Today" },
          { icon: "📊", val: `${rate}%`, label: "Completion" },
          { icon: "🔥", val: totalStreak, label: "Streak Days" },
        ].map((s) => (
          <Card key={s.label} theme={theme} style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ color: "#8b5cf6", fontSize: "22px", fontWeight: "800", lineHeight: 1 }}>{s.val}</div>
            <div style={{ color: theme.textSub, fontSize: "11px", marginTop: "4px", fontWeight: "600" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      {dueToday.length > 0 && (
        <Card theme={theme} style={{ padding: "16px 20px", marginBottom: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: theme.textSub, fontSize: "13px", fontWeight: "600" }}>Daily Progress</span>
            <span style={{ color: theme.text, fontSize: "13px", fontWeight: "800" }}>{rate}%</span>
          </div>
          <div style={{ background: theme.bgHover, borderRadius: "99px", height: "9px", overflow: "hidden" }}>
            <div style={{ width: `${rate}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#22c55e)", borderRadius: "99px", transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
          </div>
        </Card>
      )}

      {/* Habit list */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h2 style={{ color: theme.text, fontSize: "17px", fontWeight: "800", margin: 0 }}>Today's Habits</h2>
        <button onClick={onAddHabit} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={14} /> Add
        </button>
      </div>

      {dueToday.length === 0 ? (
        <div style={{ background: theme.bgCard, border: `2px dashed ${theme.border}`, borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>🌱</div>
          <p style={{ color: theme.textSub, margin: 0, fontSize: "15px" }}>No habits today — create your first one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {dueToday.map((h) => (
            <HabitRow key={h.id} habit={h}
              done={logs.some((l) => l.habitId === h.id && l.date === today && l.completed)}
              streak={calcStreak(h.id, logs)}
              onToggle={() => onToggle(h.id, today)}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HABITS PAGE (full management)
═══════════════════════════════════════════════════════════════ */
function HabitsPage({ habits, logs, onAdd, onEdit, onDelete, onToggle, theme }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const today = todayStr();

  const filtered = habits.filter((h) => {
    const matchName = h.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || h.category === catFilter;
    return matchName && matchCat;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: 0 }}>My Habits</h1>
        <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,.35)" }}>
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search habits…"
          style={{ flex: 1, minWidth: "160px", padding: "10px 14px", background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c3aed")} onBlur={(e) => (e.target.style.borderColor = theme.border)}
        />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          style={{ padding: "10px 14px", background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", cursor: "pointer", colorScheme: "dark" }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>🌱</div>
          <p style={{ color: theme.textSub, fontSize: "15px" }}>No habits yet — start building one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((h) => {
            const totalDone = logs.filter((l) => l.habitId === h.id && l.completed).length;
            return (
              <div key={h.id}>
                <HabitRow habit={h}
                  done={logs.some((l) => l.habitId === h.id && l.date === today && l.completed)}
                  streak={calcStreak(h.id, logs)}
                  onToggle={() => onToggle(h.id, today)}
                  onEdit={() => onEdit(h)} onDelete={() => onDelete(h.id)}
                  theme={theme}
                />
                {h.description && (
                  <div style={{ marginLeft: "58px", marginTop: "-4px", color: theme.textSub, fontSize: "12px", paddingBottom: "2px" }}>{h.description} &nbsp;·&nbsp; {totalDone} completions total</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CALENDAR PAGE
═══════════════════════════════════════════════════════════════ */
function CalendarPage({ habits, logs, theme }) {
  const [cur, setCur] = useState(new Date());
  const [selected, setSel] = useState(null); // day number

  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDow = (() => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; })(); // Mon=0

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const today = todayStr();
  const selStr = selected ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selected).padStart(2, "0")}` : null;

  const dayStatus = (day) => {
    if (!day) return null;
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (ds > today) return "future";
    const due = habits.filter((h) => isHabitDue(h, ds));
    if (!due.length) return "none";
    const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
    if (done.length === 0) return "missed";
    if (done.length === due.length) return "complete";
    return "partial";
  };

  const DOT = { complete: "#22c55e", partial: "#f59e0b", missed: "#ef4444" };
  const BG = { complete: "#22c55e18", partial: "#f59e0b18", missed: "#ef444418", future: "transparent", none: "transparent" };

  const selHabits = selStr ? habits.filter((h) => isHabitDue(h, selStr)) : [];

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: "0 0 24px" }}>Calendar</h1>

      <Card theme={theme} style={{ marginBottom: "16px" }}>
        {/* Month nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => setCur(new Date(year, month - 1, 1))} style={{ padding: "8px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", color: theme.text, display: "flex" }}><ChevronLeft size={16} /></button>
          <span style={{ color: theme.text, fontWeight: "800", fontSize: "17px" }}>{MONTH_NAMES[month]} {year}</span>
          <button onClick={() => setCur(new Date(year, month + 1, 1))} style={{ padding: "8px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", color: theme.text, display: "flex" }}><ChevronRight size={16} /></button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "8px" }}>
          {WEEKDAY_LABELS.map((d) => <div key={d} style={{ textAlign: "center", color: theme.textSub, fontSize: "11px", fontWeight: "700", padding: "4px" }}>{d}</div>)}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
          {cells.map((day, i) => {
            const st = dayStatus(day);
            const ds = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
            const isToday = ds === today;
            const isSel = day === selected;
            return (
              <div key={i} onClick={() => day && setSel(day === selected ? null : day)}
                style={{
                  aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "9px", cursor: day ? "pointer" : "default", position: "relative", transition: "all 0.15s",
                  background: isSel ? "#7c3aed" : BG[st] ?? "transparent",
                  border: isToday ? "2px solid #7c3aed" : "2px solid transparent",
                }}>
                {day && (
                  <>
                    <span style={{ color: isSel ? "#fff" : isToday ? "#8b5cf6" : theme.text, fontSize: "12px", fontWeight: isToday || isSel ? "800" : "500" }}>{day}</span>
                    {st && DOT[st] && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: DOT[st], marginTop: "2px" }} />}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
          {[["#22c55e", "All done"], ["#f59e0b", "Partial"], ["#ef4444", "Missed"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
              <span style={{ color: theme.textSub, fontSize: "12px" }}>{l}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected date detail */}
      {selStr && (
        <Card theme={theme}>
          <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "16px", margin: "0 0 14px" }}>
            {new Date(selStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {selHabits.length === 0
            ? <p style={{ color: theme.textSub, margin: 0 }}>No habits scheduled for this day.</p>
            : selHabits.map((h) => {
              const cat = CATEGORIES.find((c) => c.id === h.category) ?? CATEGORIES[7];
              const done = logs.some((l) => l.habitId === h.id && l.date === selStr && l.completed);
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: theme.bgHover, borderRadius: "10px", marginBottom: "8px" }}>
                  <span>{cat.emoji}</span>
                  <span style={{ flex: 1, color: theme.text, fontSize: "14px", fontWeight: "600" }}>{h.name}</span>
                  <span style={{ fontSize: "18px" }}>{done ? "✅" : "❌"}</span>
                </div>
              );
            })}
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS PAGE
═══════════════════════════════════════════════════════════════ */
function AnalyticsPage({ habits, logs, theme }) {
  // Last 7 days bar chart data
  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = fmtDate(d);
    const due = habits.filter((h) => isHabitDue(h, ds));
    const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
    return { day: d.toLocaleDateString("en-US", { weekday: "short" }), total: due.length, completed: done.length, rate: due.length ? Math.round((done.length / due.length) * 100) : 0 };
  }), [habits, logs]);

  // Last 4 weeks line chart
  const last4w = useMemo(() => Array.from({ length: 4 }, (_, wi) => {
    let completed = 0, total = 0;
    for (let d = 0; d < 7; d++) {
      const dt = new Date(); dt.setDate(dt.getDate() - (3 - wi) * 7 - (6 - d));
      const ds = fmtDate(dt);
      const due = habits.filter((h) => isHabitDue(h, ds));
      const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
      total += due.length; completed += done.length;
    }
    return { week: `Wk ${wi + 1}`, rate: total ? Math.round((completed / total) * 100) : 0 };
  }), [habits, logs]);

  // Heatmap: 16 weeks × 7 days
  const heatmap = useMemo(() => {
    const weeks = [];
    for (let w = 15; w >= 0; w--) {
      const week = [];
      for (let d = 6; d >= 0; d--) {
        const dt = new Date(); dt.setDate(dt.getDate() - w * 7 - d);
        const ds = fmtDate(dt);
        const due = habits.filter((h) => isHabitDue(h, ds));
        const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
        week.push({ ds, rate: due.length ? done.length / due.length : -1, count: done.length });
      }
      weeks.push(week);
    }
    return weeks;
  }, [habits, logs]);

  const heatColor = (rate) => {
    if (rate < 0) return theme.bgHover;
    if (rate === 0) return "#7c3aed15";
    if (rate < 0.4) return "#7c3aed44";
    if (rate < 0.7) return "#7c3aed88";
    return "#7c3aed";
  };

  // Summary stats
  const totalDone = logs.filter((l) => l.completed).length;
  const bestStreak = habits.reduce((mx, h) => Math.max(mx, calcStreak(h.id, logs).longest), 0);
  const completedThisWeek = last7.reduce((s, d) => s + d.completed, 0);
  const thisWeekRate = last7.reduce((s, d) => s + d.total, 0) ? Math.round((completedThisWeek / last7.reduce((s, d) => s + d.total, 0)) * 100) : 0;

  // Category breakdown
  const catStats = CATEGORIES.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat.id);
    const done = logs.filter((l) => l.completed && catHabits.some((h) => h.id === l.habitId)).length;
    return { ...cat, done };
  }).filter((c) => c.done > 0).sort((a, b) => b.done - a.done);

  const tooltip = { contentStyle: { background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "13px" } };

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: "0 0 24px" }}>Analytics</h1>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", marginBottom: "22px" }}>
        {[
          { emoji: "✅", val: totalDone, label: "All-time Completions" },
          { emoji: "🎯", val: `${thisWeekRate}%`, label: "This Week Rate" },
          { emoji: "🔥", val: `${bestStreak}d`, label: "Best Streak" },
          { emoji: "💪", val: habits.length, label: "Active Habits" },
        ].map((s) => (
          <Card key={s.label} theme={theme} style={{ padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>{s.emoji}</div>
            <div style={{ color: "#8b5cf6", fontSize: "26px", fontWeight: "800" }}>{s.val}</div>
            <div style={{ color: theme.textSub, fontSize: "11px", marginTop: "4px", fontWeight: "600" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* 7-day bar chart */}
      <Card theme={theme} style={{ marginBottom: "18px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 18px" }}>This Week</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={last7} barSize={24} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: theme.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.textSub, fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
            <Tooltip {...tooltip} formatter={(v, n) => [v, n === "completed" ? "Done" : "Due"]} />
            <Bar dataKey="total" fill={theme.bgHover} radius={[4, 4, 0, 0]} name="Due" />
            <Bar dataKey="completed" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Done" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 4-week trend */}
      <Card theme={theme} style={{ marginBottom: "18px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 18px" }}>4-Week Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={last4w}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
            <XAxis dataKey="week" tick={{ fill: theme.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.textSub, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} width={28} />
            <Tooltip {...tooltip} formatter={(v) => [`${v}%`, "Rate"]} />
            <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* GitHub-style Heatmap */}
      <Card theme={theme} style={{ marginBottom: "18px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 14px" }}>Activity Heatmap</h3>
        <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
          <div style={{ display: "flex", gap: "3px", minWidth: "fit-content" }}>
            {heatmap.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {week.map((cell, di) => (
                  <div key={di} title={`${cell.ds}: ${cell.count} done`}
                    style={{ width: "14px", height: "14px", borderRadius: "3px", background: heatColor(cell.rate), cursor: "default", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "10px" }}>
          <span style={{ color: theme.textSub, fontSize: "11px" }}>Less</span>
          {[-1, 0, 0.3, 0.6, 1].map((r, i) => <div key={i} style={{ width: "12px", height: "12px", borderRadius: "3px", background: heatColor(r) }} />)}
          <span style={{ color: theme.textSub, fontSize: "11px" }}>More</span>
        </div>
      </Card>

      {/* Category breakdown */}
      {catStats.length > 0 && (
        <Card theme={theme}>
          <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>By Category</h3>
          {catStats.map((c) => (
            <div key={c.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: theme.text, fontSize: "13px", fontWeight: "600" }}>{c.emoji} {c.label}</span>
                <span style={{ color: theme.textSub, fontSize: "13px" }}>{c.done}</span>
              </div>
              <div style={{ background: theme.bgHover, borderRadius: "99px", height: "7px" }}>
                <div style={{ width: `${(c.done / catStats[0].done) * 100}%`, height: "100%", background: c.color, borderRadius: "99px", transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════════════════════════════ */
function SettingsPage({ user, darkMode, onToggleDark, onLogout, habits, logs, theme }) {
  const [msg, setMsg] = useState("");

  const download = (content, filename, type) => {
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([content], { type })), download: filename });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const exportJSON = () => {
    download(JSON.stringify({ user: { name: user.name, email: user.email }, habits, logs, exportedAt: new Date().toISOString() }, null, 2), "habitflow-export.json", "application/json");
    setMsg("JSON exported!"); setTimeout(() => setMsg(""), 2500);
  };

  const exportCSV = () => {
    const rows = [["Habit", "Category", "Date", "Completed"]];
    logs.forEach((l) => { const h = habits.find((x) => x.id === l.habitId); if (h) rows.push([h.name, h.category, l.date, l.completed]); });
    download(rows.map((r) => r.join(",")).join("\n"), "habitflow-export.csv", "text/csv");
    setMsg("CSV exported!"); setTimeout(() => setMsg(""), 2500);
  };

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.border}` }}>
      <span style={{ color: theme.textSub, fontSize: "14px" }}>{label}</span>
      <span style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: "0 0 24px" }}>Settings</h1>

      {/* Profile */}
      <Card theme={theme} style={{ marginBottom: "14px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Profile</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "22px", fontWeight: "800", color: "#fff" }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ color: theme.text, fontWeight: "800", fontSize: "17px" }}>{user.name}</div>
            <div style={{ color: theme.textSub, fontSize: "13px" }}>{user.email}</div>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card theme={theme} style={{ marginBottom: "14px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Appearance</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {darkMode ? <Moon size={18} color="#8b5cf6" /> : <Sun size={18} color="#f59e0b" />}
            <div>
              <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>Dark Mode</div>
              <div style={{ color: theme.textSub, fontSize: "12px" }}>{darkMode ? "Currently on" : "Currently off"}</div>
            </div>
          </div>
          {/* Toggle switch */}
          <div onClick={onToggleDark} style={{ width: "50px", height: "27px", borderRadius: "99px", background: darkMode ? "#7c3aed" : theme.bgHover, border: `1px solid ${theme.border}`, cursor: "pointer", position: "relative", transition: "background 0.25s" }}>
            <div style={{ position: "absolute", top: "3px", left: darkMode ? "25px" : "3px", width: "19px", height: "19px", borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
          </div>
        </div>
      </Card>

      {/* Data Export */}
      <Card theme={theme} style={{ marginBottom: "14px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Export Data</h3>
        {msg && <div style={{ color: "#22c55e", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>✅ {msg}</div>}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={exportJSON} style={{ flex: 1, padding: "12px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, cursor: "pointer", fontWeight: "700", fontSize: "13px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Download size={14} /> JSON
          </button>
          <button onClick={exportCSV} style={{ flex: 1, padding: "12px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, cursor: "pointer", fontWeight: "700", fontSize: "13px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Download size={14} /> CSV
          </button>
        </div>
      </Card>

      {/* Stats */}
      <Card theme={theme} style={{ marginBottom: "20px" }}>
        <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 4px" }}>Account Stats</h3>
        <Row label="Habits created" value={habits.length} />
        <Row label="Log entries" value={logs.length} />
        <Row label="Completed sessions" value={logs.filter((l) => l.completed).length} />
        <Row label="Member since" value={new Date(user.createdAt ?? Date.now()).toLocaleDateString()} />
      </Card>

      {/* Logout */}
      <button onClick={onLogout} style={{ width: "100%", padding: "15px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: "14px", color: "#ef4444", cursor: "pointer", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR (Desktop)
═══════════════════════════════════════════════════════════════ */
const NAV = [
  { id: "dashboard", Icon: Home, label: "Dashboard" },
  { id: "habits", Icon: List, label: "Habits" },
  { id: "calendar", Icon: Calendar, label: "Calendar" },
  { id: "analytics", Icon: BarChart2, label: "Analytics" },
  { id: "settings", Icon: Settings, label: "Settings" },
];

function Sidebar({ active, setActive, darkMode, onToggleDark, user, theme }) {
  return (
    <div style={{ width: "224px", background: theme.bgCard, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 12px rgba(124,58,237,.4)" }}>🔥</div>
          <div>
            <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px", letterSpacing: "-0.3px" }}>HabitFlow</div>
            <div style={{ color: theme.textSub, fontSize: "11px" }}>Track your progress</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV.map(({ id, Icon: Ic, label }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => setActive(id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: on ? "700" : "500", transition: "all 0.15s",
                background: on ? "rgba(124,58,237,.15)" : "transparent",
                color: on ? "#8b5cf6" : theme.textSub,
                borderLeft: on ? "3px solid #7c3aed" : "3px solid transparent",
              }}>
              <Ic size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "800", flexShrink: 0 }}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: theme.text, fontWeight: "700", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
        </div>
        <button onClick={onToggleDark} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSub, padding: "4px", display: "flex" }}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
═══════════════════════════════════════════════════════════════ */
function MobileNav({ active, setActive, theme }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: theme.bgCard, borderTop: `1px solid ${theme.border}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      {NAV.map(({ id, Icon: Ic, label }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => setActive(id)}
            style={{ flex: 1, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            <Ic size={20} color={on ? "#8b5cf6" : theme.textSub} />
            <span style={{ fontSize: "10px", color: on ? "#8b5cf6" : theme.textSub, fontWeight: on ? "700" : "500" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null); // null | "new" | habitObj
  const [isMobile, setMobile] = useState(window.innerWidth < 768);

  const theme = getTheme(darkMode);

  /* ─── Bootstrap ─────────────────────────────────── */
  useEffect(() => {
    // Responsive listener
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    // Restore dark mode pref
    const dm = store.get("darkMode");
    if (dm !== null) setDarkMode(dm);

    // Restore session
    const u = store.get("currentUser");
    if (u) { setUser(u); loadData(u.id); }

    // Seed demo account
    const users = store.get("users") ?? [];
    if (!users.find((u) => u.email === "demo@habitflow.com")) {
      const demo = { id: "demo-001", name: "Demo User", email: "demo@habitflow.com", passwordHash: hashPw("demo123"), createdAt: new Date(Date.now() - 45 * 864e5).toISOString() };
      store.set("users", [...users, demo]);
    }

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadData = useCallback((userId) => {
    setHabits((store.get("habits") ?? []).filter((h) => h.userId === userId));
    setLogs((store.get("habitLogs") ?? []).filter((l) => l.userId === userId));
  }, []);

  /* ─── Auth ───────────────────────────────────────── */
  const handleAuth = (u) => { setUser(u); loadData(u.id); };
  const handleLogout = () => { store.remove("currentUser"); setUser(null); setHabits([]); setLogs([]); };
  const toggleDark = () => setDarkMode((d) => { store.set("darkMode", !d); return !d; });

  /* ─── Habit CRUD ─────────────────────────────────── */
  const saveHabit = useCallback((formData) => {
    const all = store.get("habits") ?? [];
    let updated;
    if (modal === "new") {
      updated = [...all, { id: uid(), userId: user.id, ...formData, createdAt: new Date().toISOString() }];
    } else {
      updated = all.map((h) => h.id === modal.id ? { ...modal, ...formData } : h);
    }
    store.set("habits", updated);
    setHabits(updated.filter((h) => h.userId === user.id));
    setModal(null);
  }, [modal, user]);

  const deleteHabit = useCallback((habitId) => {
    if (!window.confirm("Delete this habit and all its history?")) return;
    const allH = (store.get("habits") ?? []).filter((h) => h.id !== habitId);
    const allL = (store.get("habitLogs") ?? []).filter((l) => l.habitId !== habitId);
    store.set("habits", allH); store.set("habitLogs", allL);
    setHabits(allH.filter((h) => h.userId === user.id));
    setLogs(allL.filter((l) => l.userId === user.id));
  }, [user]);

  /* ─── Log toggle ─────────────────────────────────── */
  const toggleLog = useCallback((habitId, dateStr) => {
    const all = store.get("habitLogs") ?? [];
    const idx = all.findIndex((l) => l.habitId === habitId && l.date === dateStr && l.userId === user.id);
    const updated = idx >= 0
      ? all.map((l, i) => i === idx ? { ...l, completed: !l.completed } : l)
      : [...all, { id: uid(), habitId, date: dateStr, completed: true, userId: user.id }];
    store.set("habitLogs", updated);
    setLogs(updated.filter((l) => l.userId === user.id));
  }, [user]);

  /* ─── Render ─────────────────────────────────────── */
  if (!user) return <AuthPage onAuth={handleAuth} />;

  const views = {
    dashboard: <Dashboard habits={habits} logs={logs} user={user} onToggle={toggleLog} onAddHabit={() => setModal("new")} theme={theme} />,
    habits: <HabitsPage habits={habits} logs={logs} onAdd={() => setModal("new")} onEdit={(h) => setModal(h)} onDelete={deleteHabit} onToggle={toggleLog} theme={theme} />,
    calendar: <CalendarPage habits={habits} logs={logs} theme={theme} />,
    analytics: <AnalyticsPage habits={habits} logs={logs} theme={theme} />,
    settings: <SettingsPage user={user} darkMode={darkMode} onToggleDark={toggleDark} onLogout={handleLogout} habits={habits} logs={logs} theme={theme} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: theme.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }
        button, input, select, textarea { font-family: "Plus Jakarta Sans", system-ui, sans-serif; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>

      {!isMobile && <Sidebar active={view} setActive={setView} darkMode={darkMode} onToggleDark={toggleDark} user={user} theme={theme} />}

      <main style={{ marginLeft: isMobile ? 0 : "224px", padding: isMobile ? "20px 16px 88px" : "36px 36px 36px", maxWidth: isMobile ? "none" : "840px" }}>
        {views[view] ?? null}
      </main>

      {isMobile && <MobileNav active={view} setActive={setView} theme={theme} />}

      {modal !== null && (
        <HabitModal
          habit={modal === "new" ? null : modal}
          onSave={saveHabit}
          onClose={() => setModal(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
