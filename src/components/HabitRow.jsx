import React from 'react'
import { CATEGORIES } from '../constants/categories';
import { Check, Edit2, Trash2 } from 'lucide-react';
import Tag from './ui/Tag';

function HabitRow({ habit, done, streak, onToggle, onEdit, onDelete, description, totalDone }) {
    const cat = CATEGORIES.find((c) => c.id === habit.category) ?? CATEGORIES[7];

    return (
        <div
            className="bg-white dark:bg-[#161b22] rounded-2xl p-3.5 px-4 flex items-center gap-3.5 transition-all duration-200"
            style={{ border: `1px solid ${done ? cat.color + "44" : "var(--border)"}` }}
        >
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all duration-200"
                style={{
                    border: `2px solid ${done ? cat.color : "#30363d"}`,
                    background: done ? cat.color : "transparent",
                }}
            >
                {done && <Check size={14} color="#fff" strokeWidth={3} />}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{cat.emoji}</span>
                    <span className={`text-[15px] font-bold truncate ${done ? "text-[#656d76] dark:text-[#8b949e] line-through" : "text-[#1c2128] dark:text-[#e6edf3]"}`}>
                        {habit.name}
                    </span>
                </div>
                <div className="flex gap-[7px] flex-wrap items-center">
                    <Tag color={cat.color}>{cat.label}</Tag>
                    <Tag color="#8b949e">{habit.frequency}</Tag>
                    {streak.current > 0 && (
                        <span className="text-[11px] text-orange-400 font-bold">🔥 {streak.current}d</span>
                    )}
                </div>
                <div className="ml-[5px] mt-[5px] text-[#656d76] dark:text-[#8b949e] text-xs pb-0.5">
                    {description}&nbsp;·&nbsp;{totalDone} completions total
                </div>
            </div>

            {/* Actions */}
            {onEdit && (
                <div className="flex gap-1.5">
                    <button
                        onClick={onEdit}
                        className="p-[7px] bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] rounded-lg cursor-pointer text-[#656d76] dark:text-[#8b949e] flex hover:bg-[#e8eaed] dark:hover:bg-[#30363d] transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-[7px] bg-red-500/10 border border-red-500/20 rounded-lg cursor-pointer text-red-500 flex hover:bg-red-500/20 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
export default HabitRow