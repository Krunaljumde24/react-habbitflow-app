import React, { useCallback, useContext, useEffect, useState } from 'react'
import { todayStr, isHabitDue, calcGlobalStreak, store } from "../utils/commonUtils"
import Card from './ui/Card';
import { Plus } from 'lucide-react';
import TaskRow from "../components/TaskRow"
import { AuthContext } from '../context/AuthContext';
import { getHabbitsByUserId, getHabbitLogsByUserId } from '../service/AppService'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';
import Loader from './ui/Loader';

function Dashboard() {

    const today = todayStr();
    const now = new Date();
    const hr = now.getHours();

    const [data, setData] = useState({
        greet: hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening",
        dateLabel: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        dueToday: [],
        doneToday: [],
        pending: [],
        rate: 0,
        streak: 0
    })

    const [loading, setLoading] = useState(true)
    const { loggedInUser, isAuthenticated } = useContext(AuthContext)
    const { setHabbits, logs, setLogs, habbits } = useContext(AppContext)
    const [user, setUser] = useState({
        name: 'Krunal Jumde'
    })
    const [userLogs, setUserLogs] = useState([])



    const setDashboardData = () => {
        setLoading(true)
        const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
        const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        const dueToday = habbits.filter((h) => isHabitDue(h, today));
        const doneToday = dueToday.filter((h) => userLogs.some((l) => l.habitId === h.id && l.date === today && l.completed));
        const pending = dueToday.filter((h) => !userLogs.some((l) => l.habitId === h.id && l.date === today && l.completed));
        const rate = dueToday.length ? Math.round((doneToday.length / dueToday.length) * 100) : 0;
        const streak = calcGlobalStreak(habbits, userLogs);

        setData({
            ...data,
            greet: greet,
            dateLabel: dateLabel,
            dueToday: dueToday,
            doneToday: doneToday,
            pending: pending,
            rate: rate,
            streak: streak
        })

        setLoading(false)
    }

    useEffect(() => {
        setDashboardData()
    }, [logs, habbits])

    const loadData = async () => {
        let id = loggedInUser.user.id;
        const data = await getHabbitsByUserId(id)
        setHabbits(data)
    }

    const loadLogs = async () => {
        setUser(loggedInUser.user)
        let id = loggedInUser.user.id;
        const logdata = await getHabbitLogsByUserId(id);
        await setUserLogs(logdata)
        setLogs(loadData)
    }
    useEffect(() => {
        if (isAuthenticated) {
            // loadData();
            loadLogs();
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
    }, [isAuthenticated])


    const onAddHabit = () => {

    }

    useEffect(() => {
        // console.log(userLogs);
        // console.log(habbits);
        setDashboardData()
    }, [])

    if (loading) return <Loader />
    else
        return (
            <div>
                {/* Greeting */}
                <p className="text-[#656d76] dark:text-[#505e6d] text-sm mb-1">{data.dateLabel}</p>
                <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-[28px] font-extrabold mb-6 tracking-tight">
                    {data.greet}, {user.name.split(" ")[0]} 👋
                </h1>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4.5">
                    {[
                        { icon: "✅", val: `${data.doneToday.length}/${data.dueToday.length}`, label: "Today" },
                        { icon: "📊", val: `${data.rate}%`, label: "Completion" },
                        { icon: "🔥", val: `${data.streak.current}d`, label: "Streak" },
                    ].map((s) => (
                        <Card key={s.label} className="p-4106! text-center">
                            <div className="text-[22px] mb-1">{s.icon}</div>
                            <div className="text-violet-500 text-[22px] font-extrabold leading-none">{s.val}</div>
                            <div className="text-[#656d76] dark:text-[#8b949e] text-[11px] mt-1 font-semibold">{s.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Progress bar */}
                {data.dueToday.length > 0 && (
                    <Card className="px-4.5! py-3.5! mb-5">
                        <div className="flex justify-between mb-2">
                            <span className="text-[#656d76] dark:text-[#8b949e] text-[13px] font-semibold">Daily Progress</span>
                            <span className={`text-[13px] font-extrabold ${data.rate === 100 ? "text-green-500" : "text-[#1c2128] dark:text-[#e6edf3]"}`}>
                                {data.doneToday.length} of {data.dueToday.length} done
                            </span>
                        </div>
                        <div className="bg-[#f6f8fa] dark:bg-[#21262d] rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-[width] duration-600 ease-in-out ${data.rate === 100 ? "gradient-success" : "gradient-progress"}`}
                                style={{ width: `${data.rate}%` }}
                            />
                        </div>
                        {data.rate === 100 && data.dueToday.length > 0 && (
                            <p className="text-green-500 text-xs font-bold mt-2 text-center">
                                🎉 Perfect day! All habits complete — streak continues!
                            </p>
                        )}
                    </Card>
                )}

                {/* Task list header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[#1c2128] dark:text-[#e6edf3] text-base font-extrabold m-0">
                        Today's Tasks
                    </h2>
                    <button
                        onClick={onAddHabit}
                        className="flex items-center gap-1.5 px-3 py-1.75 gradient-brand border-none rounded-lg text-white text-xs font-bold cursor-pointer font-sans"
                    >
                        <Plus size={13} /> Add
                    </button>
                </div>

                {data.dueToday.length === 0 ? (
                    <div className="bg-white dark:bg-[#161b22] border-2 border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-2xl py-12 px-6 text-center">
                        <div className="text-5xl mb-3">🌱</div>
                        <p className="text-[#656d76] dark:text-[#8b949e] m-0 text-[15px]">No habits today — create your first one!</p>
                    </div>
                ) : (
                    <Card className="p-1.5!">
                        {/* Pending section */}
                        {data.pending.length > 0 && (
                            <>
                                <div className="px-3.5 pt-2 pb-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#656d76] dark:bg-[#8b949e]" />
                                    <span className="text-[#656d76] dark:text-[#8b949e] text-[11px] font-bold uppercase tracking-[0.07em]">
                                        Pending — {data.pending.length}
                                    </span>
                                </div>
                                {data.pending.map((h) => (
                                    <TaskRow
                                        key={h.id}
                                        habit={h}
                                    />
                                ))}
                            </>
                        )}

                        {/* Divider */}
                        {data.pending.length > 0 && data.doneToday.length > 0 && (
                            <div className="h-px bg-[#d0d7de] dark:bg-[#30363d] mx-3.5 mt-1" />
                        )}

                        {/* Completed section */}
                        {data.doneToday.length > 0 && (
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