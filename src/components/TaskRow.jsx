import React, { useEffect, useState } from 'react'
import { CATEGORIES } from '../constants/categories';
import { Check } from 'lucide-react';
import Tag from './ui/Tag';

function TaskRow({ habit, readOnly = false }) {

    const cat = CATEGORIES.find((c) => c.id === habit.category) ?? CATEGORIES[7];

    const [done, setDone] = useState(false)

    const toggleTasklog = (h) => {
        if (!readOnly) {
            setDone(!done)
        }
    }

    return (
        <div
            onClick={() => toggleTasklog(habit)}
            className={`
                flex items-center gap-3 px-3.5 py-2.75 rounded-[10px]
                transition-colors duration-150 select-none
                ${readOnly ? "cursor-default" : "cursor-pointer hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"}
            `}
            style={{ background: done ? `${cat.color}10` : "transparent" }}
        >
            {/* Square checkbox */}
            <div
                className="w-5.5 h-5.5 rounded-md shrink-0 flex items-center justify-center transition-all duration-[180ms]"
                style={{
                    border: `2px solid ${done ? cat.color : "#30363d"}`,
                    background: done ? cat.color : "transparent",
                    opacity: readOnly ? 0.7 : 1,
                }}
            >
                {done && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>

            {/* Category emoji */}
            <span className="text-[17px] leading-none shrink-0">{cat.emoji}</span>

            {/* Name + description */}
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${done ? "text-[#656d76] dark:text-[#8b949e] line-through" : "text-[#1c2128] dark:text-[#e6edf3]"}`}>
                    {habit.name}
                </div>
                {habit.description && (
                    <div className="text-[#656d76] dark:text-[#8b949e] text-[11px] mt-px truncate">
                        {habit.description}
                    </div>
                )}
            </div>

            {/* Badge / status */}
            <div className="flex items-center gap-1.5 shrink-0">
                {!readOnly && <Tag color={cat.color}>{cat.label}</Tag>}
                {readOnly && <span className="text-[17px]">{done ? "✅" : "❌"}</span>}
            </div>
        </div>
    );
}

export default TaskRow