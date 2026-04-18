import React, { useCallback, useContext, useEffect, useState } from 'react'
import { todayStr, isHabitDue, calcGlobalStreak, store } from "../utils/commonUtils"
import Card from './ui/Card';
import { Plus } from 'lucide-react';
import TaskRow from "../components/TaskRow"
import { AuthContext } from '../context/AuthContext';

function Dashboard({ onAddHabit }) {

    const [user, setUser] = useState(null)
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true)

    const loadData = useCallback(() => {
        // setHabits((store.get("habits") ?? []).filter((h) => h.userId === userId));
        // setLogs((store.get("habitLogs") ?? []).filter((l) => l.userId === userId));
        const data = store.get("currentUser");
        // console.log(data);
        // console.log(data.user);

        setUser(data.user)

        // if (u) {
        //     setUser(u); loadData(u.id);
        // }
    }, []);

    /* ─── Log toggle ─────────────────────────────────── */
    // const toggleLog = useCallback((habitId, dateStr) => {
    //     const all = store.get("habitLogs") ?? [];
    //     const idx = all.findIndex((l) => l.habitId === habitId && l.date === dateStr && l.userId === user.id);
    //     const updated = idx >= 0
    //         ? all.map((l, i) => i === idx ? { ...l, completed: !l.completed } : l)
    //         : [...all, { id: uid(), habitId, date: dateStr, completed: true, userId: user.id }];
    //     store.set("habitLogs", updated);
    //     setLogs(updated.filter((l) => l.userId === user.id));
    // }, [user]);

    const today = todayStr();
    const dueToday = habits.filter((h) => isHabitDue(h, today));
    const doneToday = dueToday.filter((h) => logs.some((l) => l.habitId === h.id && l.date === today && l.completed));
    // const pending = dueToday.filter((h) => !logs.some((l) => l.habitId === h.id && l.date === today && l.completed));
    const rate = dueToday.length ? Math.round((doneToday.length / dueToday.length) * 100) : 0;
    const { current: streak } = calcGlobalStreak(habits, logs);

    const now = new Date();
    const hr = now.getHours();
    const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    useEffect(() => {
        // Restore session

        loadData();
        setLoading(false)

    }, [])

    if (loading) return <h1>Loading...</h1>

    return (
        <div>
            {/* Greeting */}
            <p className="text-[#656d76] dark:text-[#505e6d] text-sm mb-1">{dateLabel}</p>
            <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-[28px] font-extrabold mb-6 tracking-tight">
                {greet}, {user.name.split(" ")[0]} 👋
            </h1>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4.5">
                {[
                    { icon: "✅", val: `${doneToday.length}/${dueToday.length}`, label: "Today" },
                    { icon: "📊", val: `${rate}%`, label: "Completion" },
                    { icon: "🔥", val: `${streak}d`, label: "Streak" },
                ].map((s) => (
                    <Card key={s.label} className="p-4! text-center">
                        <div className="text-[22px] mb-1">{s.icon}</div>
                        <div className="text-violet-500 text-[22px] font-extrabold leading-none">{s.val}</div>
                        <div className="text-[#656d76] dark:text-[#8b949e] text-[11px] mt-1 font-semibold">{s.label}</div>
                    </Card>
                ))}
            </div>

            {/* Progress bar */}
            {dueToday.length > 0 && (
                <Card className="px-4.5! py-3.5! mb-5">
                    <div className="flex justify-between mb-2">
                        <span className="text-[#656d76] dark:text-[#8b949e] text-[13px] font-semibold">Daily Progress</span>
                        <span className={`text-[13px] font-extrabold ${rate === 100 ? "text-green-500" : "text-[#1c2128] dark:text-[#e6edf3]"}`}>
                            {doneToday.length} of {dueToday.length} done
                        </span>
                    </div>
                    <div className="bg-[#f6f8fa] dark:bg-[#21262d] rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-[width] duration-600 ease-in-out ${rate === 100 ? "gradient-success" : "gradient-progress"}`}
                            style={{ width: `${rate}%` }}
                        />
                    </div>
                    {rate === 100 && dueToday.length > 0 && (
                        <p className="text-green-500 text-xs font-bold mt-2 text-center">
                            🎉 Perfect day! All habits complete — streak continues!
                        </p>
                    )}
                </Card>
            )}

            {/* Task list header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-[#1c2128] dark:text-[#e6edf3] text-base font-extrabold m-0">Today's Tasks</h2>
                <button
                    onClick={onAddHabit}
                    className="flex items-center gap-1.5 px-3 py-1.75 gradient-brand border-none rounded-lg text-white text-xs font-bold cursor-pointer font-sans"
                >
                    <Plus size={13} /> Add
                </button>
            </div>

            {dueToday.length === 0 ? (
                <div className="bg-white dark:bg-[#161b22] border-2 border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-2xl py-12 px-6 text-center">
                    <div className="text-5xl mb-3">🌱</div>
                    <p className="text-[#656d76] dark:text-[#8b949e] m-0 text-[15px]">No habits today — create your first one!</p>
                </div>
            ) : (
                <Card className="p-1.5!">
                    {/* Pending section */}
                    {pending.length > 0 && (
                        <>
                            <div className="px-3.5 pt-2 pb-1 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#656d76] dark:bg-[#8b949e]" />
                                <span className="text-[#656d76] dark:text-[#8b949e] text-[11px] font-bold uppercase tracking-[0.07em]">
                                    Pending — {pending.length}
                                </span>
                            </div>
                            {pending.map((h) => (
                                <TaskRow
                                    key={h.id}
                                    habit={h}
                                    done={false}
                                    onToggle={() => toggleLog(h.id, today)} />
                            ))}
                        </>
                    )}

                    {/* Divider */}
                    {pending.length > 0 && doneToday.length > 0 && (
                        <div className="h-px bg-[#d0d7de] dark:bg-[#30363d] mx-3.5 mt-1" />
                    )}

                    {/* Completed section */}
                    {doneToday.length > 0 && (
                        <>
                            <div className="px-3.5 pt-2 pb-1 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-green-500 text-[11px] font-bold uppercase tracking-[0.07em]">
                                    Completed — {doneToday.length}
                                </span>
                            </div>
                            {doneToday.map((h) => (
                                <TaskRow key={h.id} habit={h} done={true} onToggle={() => onToggle(h.id, today)} />
                            ))}
                        </>
                    )}
                </Card>
            )}




        </div>
    );
}
export default Dashboard