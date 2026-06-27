import React, { useContext, useEffect, useState } from 'react'
import { todayStr, isHabitDue } from "../utils/commonUtils"
import Card from '../components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from "../constants/months"
import { WEEKDAY_LABELS } from "../constants/weekLabes"
import TaskRow from '../components/TaskRow';
import { AppContext } from '../context/AppContext.jsx'

function CalendarPage() {
    const [cur, setCur] = useState(new Date());
    const [selected, setSel] = useState(null);

    const { habbits, logs, setLoading , loading} = useContext(AppContext)

    const year = cur.getFullYear();
    const month = cur.getMonth();
    const firstDow = (() => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; })();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const today = todayStr();
    const selStr = selected
        ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selected).padStart(2, "0")}`
        : null;

    const dayStatus = (day) => {
        if (!day) return null;
        const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (ds > today) return "future";
        const due = habbits.filter((h) => isHabitDue(h, ds));
        if (!due.length) return "none";
        const done = due.filter((h) => logs.some((l) => l.habitId === h.id && l.date === ds && l.completed));
        if (done.length === 0) return "missed";
        if (done.length === due.length) return "complete";
        return "partial";
    };

    const DOT = { complete: "#22c55e", partial: "#f59e0b", missed: "#ef4444" };
    const BG = { complete: "#22c55e18", partial: "#f59e0b18", missed: "#ef444418", future: "transparent", none: "transparent" };

    useEffect(() => {
        console.log('test');
        console.log(loading);
        
        setLoading(false)

    }, [])
    return (
        <div>
            <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-2xl font-extrabold m-0 mb-6">Calendar</h1>

            <Card className="mb-4">
                {/* Month nav */}
                <div className="flex justify-between items-center mb-5">
                    <button
                        onClick={() => setCur(new Date(year, month - 1, 1))}
                        className="p-2 bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] rounded-lg cursor-pointer text-[#1c2128] dark:text-[#e6edf3] flex hover:bg-[#e8eaed] dark:hover:bg-[#30363d] transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[17px]">
                        {MONTH_NAMES[month]} {year}
                    </span>
                    <button
                        onClick={() => setCur(new Date(year, month + 1, 1))}
                        className="p-2 bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] rounded-lg cursor-pointer text-[#1c2128] dark:text-[#e6edf3] flex hover:bg-[#e8eaed] dark:hover:bg-[#30363d] transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {WEEKDAY_LABELS.map((d) => (
                        <div key={d} className="text-center text-[#656d76] dark:text-[#8b949e] text-[11px] font-bold p-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                        const st = dayStatus(day);
                        const ds = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                        const isToday = ds === today;
                        const isSel = day === selected;
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (!day) return;
                                    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                    if (ds > today) return;
                                    setSel(day === selected ? null : day);
                                }}
                                className="aspect-square flex flex-col items-center justify-center rounded-[9px] relative transition-all duration-150"
                                style={{
                                    cursor: day ? "pointer" : "default",
                                    background: isSel ? "#7c3aed" : (BG[st] ?? "transparent"),
                                    border: isToday ? "2px solid #7c3aed" : "2px solid transparent",
                                }}
                            >
                                {day && (
                                    <>
                                        <span
                                            className="text-xs"
                                            style={{
                                                color: isSel ? "#fff" : isToday ? "#8b5cf6" : "",
                                                fontWeight: isToday || isSel ? 800 : 500,
                                            }}
                                            {...(!isSel && !isToday && { className: "text-xs text-[#1c2128] dark:text-[#e6edf3] font-medium" })}
                                        >
                                            {day}
                                        </span>
                                        {st && DOT[st] && (
                                            <div className="w-[5px] h-[5px] rounded-full mt-0.5" style={{ background: DOT[st] }} />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 flex-wrap">
                    {[["#22c55e", "All done"], ["#f59e0b", "Partial"], ["#ef4444", "Missed"]].map(([c, l]) => (
                        <div key={l} className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                            <span className="text-[#656d76] dark:text-[#8b949e] text-xs">{l}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Selected date detail */}
            {selStr && (() => {
                const isToday = selStr === today;
                const isPast = selStr < today;
                const isFuture = selStr > today;
                const selHabitsForDay = habbits.filter((h) => isHabitDue(h, selStr));
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-3.5">
                            <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-base m-0">
                                {new Date(selStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </h3>
                            {isToday && (
                                <span className="text-[11px] font-bold text-green-500 bg-green-500/10 px-2.5 py-[3px] rounded-full">Today</span>
                            )}
                            {isPast && (
                                <span className="text-[11px] font-bold text-[#656d76] dark:text-[#8b949e] bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-[3px] rounded-full flex items-center gap-1">
                                    🔒 Read-only
                                </span>
                            )}
                        </div>

                        {selHabitsForDay.length === 0 ? (
                            <p className="text-[#656d76] dark:text-[#8b949e] m-0 text-sm">No habits scheduled for this day.</p>
                        ) : isFuture ? (
                            <p className="text-[#656d76] dark:text-[#8b949e] m-0 text-sm">Future dates can't be edited.</p>
                        ) : (
                            <>
                                {isToday && (
                                    <p className="text-[#656d76] dark:text-[#8b949e] text-xs m-0 mb-2.5">
                                        Click a task to toggle its status.
                                    </p>
                                )}
                                {selHabitsForDay.map((h) => {
                                    const done = logs.some((l) => l.habitId === h.id && l.date === selStr && l.completed);
                                    return (
                                        <TaskRow
                                            key={h.id} habit={h} done={done}
                                            readOnly={!isToday}
                                            onToggle={isToday ? () => onToggle(h.id, selStr) : undefined}
                                        />
                                    );
                                })}
                                {isPast && (
                                    <p className="text-[#656d76] dark:text-[#8b949e] text-[11px] m-0 mt-2.5 text-center">
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