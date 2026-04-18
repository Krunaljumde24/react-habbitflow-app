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
const uid = () => Math.random().toString(36).slice(2) + Da+te.now().toString(36);

/** Simple password hashing (use bcrypt on real backend) */
const hashPw = (pw) => btoa(encodeURIComponent(pw + "__hf_salt__"));

/** localStorage helpers */
const store = {
  get: (k) => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch {
      return null;
    }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem(k),
};

/**
 * Returns which weekday indices (Mon=0…Sun=6) a habit is due on.
 */
const getHabitWeekdays = (habit) => {
  switch (habit.frequency) {
    case "daily":
      return [0, 1, 2, 3, 4, 5, 6];
    case "weekdays":
      return [0, 1, 2, 3, 4];
    case "weekends":
      return [5, 6];
    case "custom":
      return habit.customDays ?? [];
    default:
      return [0, 1, 2, 3, 4, 5, 6];
  }
};

/** Is this habit due on a given dateStr? */
const isHabitDue = (habit, dateStr) => {
  if (habit.startDate > dateStr) return false;
  const jsDay = new Date(dateStr + "T12:00:00").getDay(); // 0=Sun
  const monFirst = jsDay === 0 ? 6 : jsDay - 1; // Mon=0..Sun=6
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
      if (doneDates[i] === fmtDate(ref)) {
        current++;
      } else break;
    }
  }

  // Longest streak (over all history)
  let longest = current,
    temp = 1;
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

/**
 * Global streak: a day only "counts" when ALL habits due that day are completed.
 * Today is NOT penalised if it is still in progress — we look from yesterday back.
 * Days with zero habits due are skipped (neutral — don't break, don't count).
 */
const calcGlobalStreak = (habits, logs) => {
  if (!habits.length) return { current: 0, longest: 0 };

  const isPerfectDay = (ds) => {
    const due = habits.filter((h) => isHabitDue(h, ds));
    if (!due.length) return null; // no habits due → skip
    return due.every((h) =>
      logs.some((l) => l.habitId === h.id && l.date === ds && l.completed),
    );
  };

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let current = 0,
    longest = 0,
    run = 0;

  for (let i = 0; i <= 365; i++) {
    const ds = fmtDate(cursor);
    const perfect = isPerfectDay(ds);

    if (perfect === true) {
      run++;
      longest = Math.max(longest, run);
    } else if (perfect === null) {
      // No habits due — neutral, keep going
    } else {
      // perfect === false
      if (i === 0) {
        // Today isn't fully done yet — that's fine, check from yesterday
      } else {
        break; // past day was missed — streak ends here
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  current = run;
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

export {
  uid,
  todayStr,
  store,
  isHabitDue,
  calcGlobalStreak,
  fmtDate,
  getHabitWeekdays,
  calcStreak,
  getTheme,
  hashPw,
};
