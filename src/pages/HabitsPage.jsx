import React, { useCallback, useContext, useEffect, useState } from 'react'
import { todayStr, calcStreak } from "../utils/commonUtils"
import { Plus } from 'lucide-react';
import HabitRow from '../components/HabitRow';
import { CATEGORIES } from '../constants/categories';
import HabitModal from '../components/HabitModal';
import DeleteModal from '../components/DeleteModal.jsx'
import { getHabbitsByUserId } from "../service/AppService.js"
import { AuthContext } from '../context/AuthContext.jsx';
import { AppContext } from '../context/AppContext.jsx';

function HabitsPage({ onEdit, onDelete }) {
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [modal, setModal] = useState(null)
    const today = todayStr();
    const [habitUpdated, setHabitUpdated] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const { loggedInUser } = useContext(AuthContext)
    const { habbits } = useContext(AppContext)

    const [logs, setLogs] = useState([
        {
            "id": "kwnkpw3noi9mn0kwhfm",
            "habitId": "yt5qktzy8imn0kqsha",
            "date": "2026-03-21",
            "completed": false,
            "userId": "demo-001"
        },
        {
            "id": "tqimnowy41mn0mb6t1",
            "habitId": "c5vbxxh8bfmn0kx9qz",
            "date": "2026-03-21",
            "completed": false,
            "userId": "demo-001"
        },
        {
            "id": "pwb9rjwftmn0mb7d0",
            "habitId": "teu2caqleimn0mazjr",
            "date": "2026-03-21",
            "completed": true,
            "userId": "demo-001"
        }])
    const [allHabits, setAllHabits] = useState([])

    const loadData = async () => {
        let userId = loggedInUser.user.id;
        const data = await getHabbitsByUserId(userId)
        setAllHabits(data)
    }

    useEffect(() => {
        loadData();
        setModal(null)
    }, [habitUpdated])

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


    var filtered = allHabits.filter((h) => {
        const matchName = h.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "all" || h.category === catFilter;
        return matchName && matchCat;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-2xl font-extrabold m-0">My Habits</h1>
                <button
                    onClick={() => setModal('new')}
                    className="flex items-center gap-1.5 px-4 py-2.5 gradient-brand border-none rounded-[10px] text-white text-sm font-extrabold cursor-pointer font-sans shadow-accent"
                >
                    <Plus size={16} /> New Habit
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2.5 mb-4.5 flex-wrap">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search habits…"
                    className="flex-1 min-w-40 px-3.5 py-2.5 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none focus:border-violet-600 transition-colors"
                />
                <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none cursor-pointer scheme-dark"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) =>
                        <option
                            key={c.id}
                            value={c.id}>
                            {c.emoji} {c.label}
                        </option>
                    )}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-15 px-5">
                    <div className="text-[52px] mb-3">🌱</div>
                    <p className="text-[#656d76] dark:text-[#8b949e] text-[15px]">No habits yet — start building one!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {filtered.map((h) => {
                        const totalDone = logs.filter((l) => l.habitId === h.id && l.completed).length;
                        return (
                            <HabitRow
                                key={h.id}
                                habit={h}
                                // done={logs.some((l) => l.habitId === h.id && l.date === today && l.completed)}
                                streak={calcStreak(h.id, logs)}
                                // onToggle={() => onToggle(h.id, today)}
                                // onEdit={() => onEdit(h)}
                                // onDelete={() => onDelete(h.id)}
                                // description={h.description}
                                totalDone={totalDone}
                                setModal={setModal}
                                modal={modal}
                                setDeleteModal={setDeleteModal}
                            />
                        );
                    })}
                </div>
            )}


            {modal !== null && (
                <HabitModal
                    habit={modal}
                    habitUpdated={habitUpdated}
                    onSave={setHabitUpdated}
                    onClose={() => setModal(null)}
                />
            )}

            {deleteModal && (

                <DeleteModal
                    onClose={setDeleteModal}
                />
            )}
        </div>
    );
}

export default HabitsPage