import React, { useState } from 'react'

import { todayStr, calcStreak } from "../utils/commonUtils"
import { Plus } from 'lucide-react';
import HabitRow from '../components/HabitRow';
import { CATEGORIES } from '../constants/categories';


function HabitsPage({ habits, logs, onAdd, onEdit, onDelete, onToggle, theme }) {
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: 0 }}>My Habits</h1>
                <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,.35)" }}>
                    <Plus size={16} /> New Habit
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search habits…"
                    style={{ flex: 1, minWidth: "160px", padding: "10px 14px", background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")} onBlur={(e) => (e.target.style.borderColor = theme.border)}
                />
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                    style={{ padding: "10px 14px", background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", cursor: "pointer", colorScheme: "dark" }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: "52px", marginBottom: "12px" }}>🌱</div>
                    <p style={{ color: theme.textSub, fontSize: "15px" }}>No habits yet — start building one!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filtered.map((h) => {
                        const totalDone = logs.filter((l) => l.habitId === h.id && l.completed).length;
                        return (
                            <div key={h.id}>
                                <HabitRow habit={h}
                                    done={logs.some((l) => l.habitId === h.id && l.date === today && l.completed)}
                                    streak={calcStreak(h.id, logs)}
                                    onToggle={() => onToggle(h.id, today)}
                                    onEdit={() => onEdit(h)} onDelete={() => onDelete(h.id)}
                                    theme={theme}
                                    description={h.description}
                                    totalDone={totalDone}
                                />
                                {/* {h.description && (
                                    <div style={{ marginLeft: "58px", marginTop: "-4px", color: theme.textSub, fontSize: "12px", paddingBottom: "2px" }}>{h.description} &nbsp;·&nbsp; {totalDone} completions total</div>
                                )} */}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HabitsPage