import React, { useState } from 'react'
import { todayStr, calcStreak } from "../utils/commonUtils"
import { Plus } from 'lucide-react';
import HabitRow from '../components/HabitRow';
import { CATEGORIES } from '../constants/categories';

function HabitsPage({ habits, logs, onAdd, onEdit, onDelete, onToggle }) {
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-2xl font-extrabold m-0">My Habits</h1>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-1.5 px-4 py-2.5 gradient-brand border-none rounded-[10px] text-white text-sm font-extrabold cursor-pointer font-sans shadow-accent"
                >
                    <Plus size={16} /> New Habit
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2.5 mb-[18px] flex-wrap">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search habits…"
                    className="flex-1 min-w-[160px] px-3.5 py-2.5 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none focus:border-violet-600 transition-colors"
                />
                <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none cursor-pointer [color-scheme:dark]"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-[60px] px-5">
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
                                done={logs.some((l) => l.habitId === h.id && l.date === today && l.completed)}
                                streak={calcStreak(h.id, logs)}
                                onToggle={() => onToggle(h.id, today)}
                                onEdit={() => onEdit(h)}
                                onDelete={() => onDelete(h.id)}
                                description={h.description}
                                totalDone={totalDone}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HabitsPage