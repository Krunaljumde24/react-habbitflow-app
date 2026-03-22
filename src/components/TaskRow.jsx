import React from 'react'
import { CATEGORIES } from '../constants/categories';
import { Check, Tag } from 'lucide-react';

function TaskRow({ habit, done, onToggle, theme, readOnly = false }) {
    const cat = CATEGORIES.find((c) => c.id === habit.category) ?? CATEGORIES[7];
    return (
        <div
            onClick={readOnly ? undefined : onToggle}
            style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "11px 14px", borderRadius: "10px",
                cursor: readOnly ? "default" : "pointer",
                transition: "background 0.15s", userSelect: "none",
                background: done ? `${cat.color}10` : "transparent",
            }}
            onMouseEnter={(e) => { if (!readOnly) e.currentTarget.style.background = theme.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = done ? `${cat.color}10` : "transparent"; }}
        >
            {/* Square checkbox */}
            <div style={{
                width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                border: `2px solid ${done ? cat.color : theme.border}`,
                background: done ? cat.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
                opacity: readOnly ? 0.7 : 1,
            }}>
                {done && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>

            {/* Category emoji */}
            <span style={{ fontSize: "17px", lineHeight: 1, flexShrink: 0 }}>{cat.emoji}</span>

            {/* Name + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    color: done ? theme.textSub : theme.text, fontSize: "14px", fontWeight: "600",
                    textDecoration: done ? "line-through" : "none",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{habit.name}</div>
                {habit.description && (
                    <div style={{ color: theme.textSub, fontSize: "11px", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {habit.description}
                    </div>
                )}
            </div>

            {/* Badge / status icon */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                {!readOnly && <Tag color={cat.color}>{cat.label}</Tag>}
                {readOnly && <span style={{ fontSize: "17px" }}>{done ? "✅" : "❌"}</span>}
            </div>
        </div>
    );
}


export default TaskRow