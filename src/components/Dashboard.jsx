import React from 'react'
import { todayStr, isHabitDue, calcGlobalStreak } from "../utils/commonUtils"
import Card from './ui/Card';
import { Plus } from 'lucide-react';

import TaskRow from "../components/TaskRow"


function Dashboard({ habits, logs, user, onToggle, onAddHabit, theme }) {
    const today = todayStr();
    const dueToday = habits.filter((h) => isHabitDue(h, today));
    const doneToday = dueToday.filter((h) => logs.some((l) => l.habitId === h.id && l.date === today && l.completed));
    const pending = dueToday.filter((h) => !logs.some((l) => l.habitId === h.id && l.date === today && l.completed));
    const rate = dueToday.length ? Math.round((doneToday.length / dueToday.length) * 100) : 0;
    const { current: streak } = calcGlobalStreak(habits, logs);

    const now = new Date();
    const hr = now.getHours();
    const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <div>
            {/* Greeting */}
            <p style={{ color: theme.textSub, fontSize: "14px", margin: "0 0 4px" }}>{dateLabel}</p>
            <h1 style={{ color: theme.text, fontSize: "28px", fontWeight: "800", margin: "0 0 24px", letterSpacing: "-0.5px" }}>
                {greet}, {user.name.split(" ")[0]} 👋
            </h1>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "18px" }}>
                {[
                    { icon: "✅", val: `${doneToday.length}/${dueToday.length}`, label: "Today" },
                    { icon: "📊", val: `${rate}%`, label: "Completion" },
                    { icon: "🔥", val: `${streak}d`, label: "Streak" },
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
                <Card theme={theme} style={{ padding: "14px 18px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: theme.textSub, fontSize: "13px", fontWeight: "600" }}>Daily Progress</span>
                        <span style={{ color: rate === 100 ? "#22c55e" : theme.text, fontSize: "13px", fontWeight: "800" }}>
                            {doneToday.length} of {dueToday.length} done
                        </span>
                    </div>
                    <div style={{ background: theme.bgHover, borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                        <div style={{ width: `${rate}%`, height: "100%", background: rate === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#7c3aed,#22c55e)", borderRadius: "99px", transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
                    </div>
                    {rate === 100 && dueToday.length > 0 && (
                        <p style={{ color: "#22c55e", fontSize: "12px", fontWeight: "700", margin: "8px 0 0", textAlign: "center" }}>
                            🎉 Perfect day! All habits complete — streak continues!
                        </p>
                    )}
                </Card>
            )}

            {/* Task list header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2 style={{ color: theme.text, fontSize: "16px", fontWeight: "800", margin: 0 }}>Today's Tasks</h2>
                <button onClick={onAddHabit} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                    <Plus size={13} /> Add
                </button>
            </div>

            {dueToday.length === 0 ? (
                <div style={{ background: theme.bgCard, border: `2px dashed ${theme.border}`, borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌱</div>
                    <p style={{ color: theme.textSub, margin: 0, fontSize: "15px" }}>No habits today — create your first one!</p>
                </div>
            ) : (
                <Card theme={theme} style={{ padding: "6px" }}>
                    {/* Pending section */}
                    {pending.length > 0 && (
                        <>
                            <div style={{ padding: "8px 14px 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.textSub }} />
                                <span style={{ color: theme.textSub, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                    Pending — {pending.length}
                                </span>
                            </div>
                            {pending.map((h) => (
                                <TaskRow key={h.id} habit={h} done={false} onToggle={() => onToggle(h.id, today)} theme={theme} />
                            ))}
                        </>
                    )}

                    {/* Divider */}
                    {pending.length > 0 && doneToday.length > 0 && (
                        <div style={{ height: "1px", background: theme.border, margin: "4px 14px 0" }} />
                    )}

                    {/* Completed section */}
                    {doneToday.length > 0 && (
                        <>
                            <div style={{ padding: "8px 14px 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                                <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                    Completed — {doneToday.length}
                                </span>
                            </div>
                            {doneToday.map((h) => (
                                <TaskRow key={h.id} habit={h} done={true} onToggle={() => onToggle(h.id, today)} theme={theme} />
                            ))}
                        </>
                    )}
                </Card>
            )}
        </div>
    );
}
export default Dashboard