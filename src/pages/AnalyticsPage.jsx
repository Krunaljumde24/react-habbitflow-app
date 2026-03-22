import React, { useMemo } from 'react'

import { fmtDate, isHabitDue, calcStreak } from "../utils/commonUtils"
import { CATEGORIES } from "../constants/categories"
import Card from '../components/ui/Card';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
export default AnalyticsPage