import React, { useContext, useMemo, useState } from 'react'
import { fmtDate, isHabitDue, calcStreak } from "../utils/commonUtils"
import { CATEGORIES } from "../constants/categories"
import Card from '../components/ui/Card';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppContext } from '../context/AppContext';

function AnalyticsPage() {

    const { habbits , logs } = useContext(AppContext)



    

    // Last 7 days
    const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        const ds = fmtDate(d);
        const due = habbits.filter((h) => isHabitDue(h, ds));
        const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
        return { day: d.toLocaleDateString("en-US", { weekday: "short" }), total: due.length, completed: done.length, rate: due.length ? Math.round((done.length / due.length) * 100) : 0 };
    }), [habbits, logs]);

    // Last 4 weeks
    const last4w = useMemo(() => Array.from({ length: 4 }, (_, wi) => {
        let completed = 0, total = 0;
        for (let d = 0; d < 7; d++) {
            const dt = new Date(); dt.setDate(dt.getDate() - (3 - wi) * 7 - (6 - d));
            const ds = fmtDate(dt);
            const due = habbits.filter((h) => isHabitDue(h, ds));
            const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
            total += due.length; completed += done.length;
        }
        return { week: `Wk ${wi + 1}`, rate: total ? Math.round((completed / total) * 100) : 0 };
    }), [habbits, logs]);

    // Heatmap: 16 weeks × 7 days
    const heatmap = useMemo(() => {
        const weeks = [];
        for (let w = 15; w >= 0; w--) {
            const week = [];
            for (let d = 6; d >= 0; d--) {
                const dt = new Date(); dt.setDate(dt.getDate() - w * 7 - d);
                const ds = fmtDate(dt);
                const due = habbits.filter((h) => isHabitDue(h, ds));
                const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
                week.push({ ds, rate: due.length ? done.length / due.length : -1, count: done.length });
            }
            weeks.push(week);
        }
        return weeks;
    }, [habbits, logs]);

    const heatColor = (rate) => {
        if (rate < 0) return "#21262d";
        if (rate === 0) return "#7c3aed15";
        if (rate < 0.4) return "#7c3aed44";
        if (rate < 0.7) return "#7c3aed88";
        return "#7c3aed";
    };

    // Summary stats
    const totalDone = logs.filter((l) => l.completed).length;
    const bestStreak = habbits.reduce((mx, h) => Math.max(mx, calcStreak(h.id, logs).longest), 0);
    const completedThisWeek = last7.reduce((s, d) => s + d.completed, 0);
    const totalThisWeek = last7.reduce((s, d) => s + d.total, 0);
    const thisWeekRate = totalThisWeek ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

    // Category breakdown
    const catStats = CATEGORIES.map((cat) => {
        const catHabits = habbits.filter((h) => h.category === cat.id);
        const done = logs.filter((l) => l.completed && catHabits.some((h) => h.id === l.habitId)).length;
        return { ...cat, done };
    }).filter((c) => c.done > 0).sort((a, b) => b.done - a.done);

    const tooltipStyle = {
        contentStyle: {
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "8px",
            color: "#e6edf3",
            fontSize: "13px",
        },
    };

    return (
        <div>
            <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-2xl font-extrabold m-0 mb-6">Analytics</h1>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 mb-5.5">
                {[
                    { emoji: "✅", val: totalDone, label: "All-time Completions" },
                    { emoji: "🎯", val: `${thisWeekRate}%`, label: "This Week Rate" },
                    { emoji: "🔥", val: `${bestStreak}d`, label: "Best Streak" },
                    { emoji: "💪", val: habbits.length, label: "Active Habits" },
                ].map((s) => (
                    <Card key={s.label} className="p-4.5! text-center">
                        <div className="text-[26px] mb-1.5">{s.emoji}</div>
                        <div className="text-violet-500 text-[26px] font-extrabold">{s.val}</div>
                        <div className="text-[#656d76] dark:text-[#8b949e] text-[11px] mt-1 font-semibold">{s.label}</div>
                    </Card>
                ))}
            </div>

            {/* 7-day bar chart */}
            <Card className="mb-4.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4.5">This Week</h3>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={last7} barSize={24} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                        <Tooltip {...tooltipStyle} formatter={(v, n) => [v, n === "completed" ? "Done" : "Due"]} />
                        <Bar dataKey="total" fill="#21262d" radius={[4, 4, 0, 0]} name="Due" />
                        <Bar dataKey="completed" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Done" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* 4-week trend */}
            <Card className="mb-4.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4.5">4-Week Trend</h3>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={last4w}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} width={28} />
                        <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Rate"]} />
                        <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Activity Heatmap */}
            <Card className="mb-4.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-3.5">Activity Heatmap</h3>
                <div className="overflow-x-auto pb-1">
                    <div className="flex gap-0.75 min-w-fit">
                        {heatmap.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-0.75">
                                {week.map((cell, di) => (
                                    <div
                                        key={di}
                                        title={`${cell.ds}: ${cell.count} done`}
                                        className="w-3.5 h-3.5 rounded-[3px] cursor-default transition-opacity duration-200 hover:opacity-70"
                                        style={{ background: heatColor(cell.rate) }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-1.25 items-center mt-2.5">
                    <span className="text-[#656d76] dark:text-[#8b949e] text-[11px]">Less</span>
                    {[-1, 0, 0.3, 0.6, 1].map((r, i) => (
                        <div key={i} className="w-3 h-3 rounded-[3px]" style={{ background: heatColor(r) }} />
                    ))}
                    <span className="text-[#656d76] dark:text-[#8b949e] text-[11px]">More</span>
                </div>
            </Card>

            {/* Category breakdown */}
            {catStats.length > 0 && (
                <Card>
                    <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4">By Category</h3>
                    {catStats.map((c) => (
                        <div key={c.id} className="mb-3">
                            <div className="flex justify-between mb-1.25">
                                <span className="text-[#1c2128] dark:text-[#e6edf3] text-[13px] font-semibold">{c.emoji} {c.label}</span>
                                <span className="text-[#656d76] dark:text-[#8b949e] text-[13px]">{c.done}</span>
                            </div>
                            <div className="bg-[#f6f8fa] dark:bg-[#21262d] rounded-full h-1.75">
                                <div
                                    className="h-full rounded-full transition-[width] duration-600"
                                    style={{ width: `${(c.done / catStats[0].done) * 100}%`, background: c.color }}
                                />
                            </div>
                        </div>
                    ))}
                </Card>
            )}
        </div>
    );
}
export default AnalyticsPage