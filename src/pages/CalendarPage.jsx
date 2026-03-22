import React, { useState } from 'react'

import { todayStr, isHabitDue } from "../utils/commonUtils"
import Card from '../components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { MONTH_NAMES } from "../constants/months"
import { WEEKDAY_LABELS } from "../constants/weekLabes"
import TaskRow from '../components/TaskRow';

function CalendarPage({ habits, logs, onToggle, theme }) {
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
                            <div key={i} onClick={() => { if (!day) return; const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; if (ds > today) return; setSel(day === selected ? null : day); }}
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
            {selStr && (() => {
                const isToday = selStr === today;
                const isPast = selStr < today;
                const isFuture = selStr > today;
                const selHabitsForDay = habits.filter((h) => isHabitDue(h, selStr));
                return (
                    <Card theme={theme}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "16px", margin: 0 }}>
                                {new Date(selStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </h3>
                            {isToday && (
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#22c55e", background: "#22c55e18", padding: "3px 10px", borderRadius: "99px" }}>Today</span>
                            )}
                            {isPast && (
                                <span style={{ fontSize: "11px", fontWeight: "700", color: theme.textSub, background: theme.bgHover, padding: "3px 10px", borderRadius: "99px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    🔒 Read-only
                                </span>
                            )}
                        </div>

                        {selHabitsForDay.length === 0 ? (
                            <p style={{ color: theme.textSub, margin: 0, fontSize: "14px" }}>No habits scheduled for this day.</p>
                        ) : isFuture ? (
                            <p style={{ color: theme.textSub, margin: 0, fontSize: "14px" }}>Future dates can't be edited.</p>
                        ) : (
                            <>
                                {isToday && (
                                    <p style={{ color: theme.textSub, fontSize: "12px", margin: "0 0 10px" }}>
                                        Click a task to toggle its status.
                                    </p>
                                )}
                                {selHabitsForDay.map((h) => {
                                    const done = logs.some((l) => l.habitId === h.id && l.date === selStr && l.completed);
                                    return (
                                        <TaskRow
                                            key={h.id} habit={h} done={done} theme={theme}
                                            readOnly={!isToday}
                                            onToggle={isToday ? () => onToggle(h.id, selStr) : undefined}
                                        />
                                    );
                                })}
                                {isPast && (
                                    <p style={{ color: theme.textSub, fontSize: "11px", margin: "10px 0 0", textAlign: "center" }}>
                                        Past entries cannot be modified.
                                    </p>
                                )}
                            </>
                        )}
                    </Card>
                );
            })()}
        </div>
    );
}

export default CalendarPage