import React from 'react'
import { CATEGORIES } from '../constants/categories';
import Tag from './ui/Tag';
import { Check, Edit2, Trash2 } from 'lucide-react';

function HabitRow({ habit, done, streak, onToggle, onEdit, onDelete, theme, description, totalDone }) {
    const cat = CATEGORIES.find((c) => c.id === habit.category) ?? CATEGORIES[7];
    return (
        <div style={{ background: theme.bgCard, border: `1px solid ${done ? cat.color + "44" : theme.border}`, borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}>
            {/* Toggle */}
            <button onClick={onToggle}
                style={{ width: "30px", height: "30px", borderRadius: "50%", border: `2px solid ${done ? cat.color : theme.border}`, background: done ? cat.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
                {done && <Check size={14} color="#fff" strokeWidth={3} />}
            </button>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "16px" }}>{cat.emoji}</span>
                    <span style={{ color: done ? theme.textSub : theme.text, fontSize: "15px", fontWeight: "700", textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{habit.name}</span>
                </div>
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" }}>
                    <Tag color={cat.color}>{cat.label}</Tag>
                    <Tag color={theme.textSub} style={{ textTransform: "capitalize" }}>{habit.frequency}</Tag>
                    {streak.current > 0 && <span style={{ fontSize: "11px", color: "#f97316", fontWeight: "700" }}>🔥 {streak.current}d</span>}
                </div>

                <div style={{ marginLeft: "5px", marginTop: "5px", color: theme.textSub, fontSize: "12px", paddingBottom: "2px" }}>
                    {description} &nbsp;·&nbsp; {totalDone} completions total
                </div>
            </div>

            {/* Actions */}
            {onEdit && (
                <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={onEdit} style={{ padding: "7px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", color: theme.textSub, display: "flex" }}>
                        <Edit2 size={14} />
                    </button>
                    <button onClick={onDelete} style={{ padding: "7px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "8px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
export default HabitRow