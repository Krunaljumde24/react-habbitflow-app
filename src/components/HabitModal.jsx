import React, { useState } from 'react'
import { todayStr } from '../utils/commonUtils'
import Field from './ui/Field';
import Input from './ui/Input';
import { X } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { WEEKDAY_LABELS } from '../constants/weekLabes';

function HabitModal({ habit, onSave, onClose }) {
    const [form, setForm] = useState({
        name: habit?.name ?? "",
        description: habit?.description ?? "",
        category: habit?.category ?? "health",
        frequency: habit?.frequency ?? "daily",
        customDays: habit?.customDays ?? [],
        startDate: habit?.startDate ?? todayStr(),
        reminder: habit?.reminder ?? "",
    });
    const [err, setErr] = useState("");

    const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
    const toggleDay = (i) => setForm((f) => ({
        ...f,
        customDays: f.customDays.includes(i)
            ? f.customDays.filter((d) => d !== i)
            : [...f.customDays, i],
    }));

    const save = () => {
        if (!form.name.trim()) { setErr("Habit name is required."); return; }
        onSave(form);
    };

    return (
        /* Overlay */
        <div
            className="fixed inset-0 bg-black/75 z-1000 flex items-center justify-center p-4 backdrop-blur-[6px]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal panel */}
            <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[20px] p-7 w-full max-w-125 max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[#1c2128] dark:text-[#e6edf3] m-0 text-xl font-extrabold">
                        {habit ? "Edit Habit" : "New Habit ✨"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none cursor-pointer text-[#656d76] dark:text-[#8b949e] p-1 flex hover:text-[#1c2128] dark:hover:text-[#e6edf3] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Name */}
                <Field label="Habit Name *">
                    <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Morning Run, Read 30 mins…"
                        autoFocus
                    />
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Optional notes…"
                        rows={2}
                        className="w-full px-3.5 py-2.75 bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none resize-y box-border focus:border-violet-600 transition-colors"
                    />
                </Field>

                {/* Category */}
                <Field label="Category">
                    <div className="grid grid-cols-4 gap-2">
                        {CATEGORIES.map((cat) => {
                            const isActive = form.category === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => set("category", cat.id)}
                                    className="py-2.5 px-1 rounded-[10px] cursor-pointer flex flex-col items-center gap-0.75 transition-all duration-150 font-sans border"
                                    style={{
                                        background: isActive ? `${cat.color}22` : "",
                                        borderColor: isActive ? cat.color : "",
                                    }}
                                    {...(!isActive && { className: "py-2.5 px-1 rounded-[10px] cursor-pointer flex flex-col items-center gap-[3px] transition-all duration-150 font-sans border bg-[#f6f8fa] dark:bg-[#0d1117] border-[#d0d7de] dark:border-[#30363d]" })}
                                >
                                    <span className="text-lg">{cat.emoji}</span>
                                    <span
                                        className="text-[10px] font-bold"
                                        style={{ color: isActive ? cat.color : undefined }}
                                        {...(!isActive && { className: "text-[10px] font-bold text-[#656d76] dark:text-[#8b949e]" })}
                                    >
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Field>

                {/* Frequency */}
                <Field label="Frequency">
                    <div className="flex gap-2 flex-wrap">
                        {["daily", "weekdays", "weekends", "custom"].map((f) => (
                            <button
                                key={f}
                                onClick={() => set("frequency", f)}
                                className={`px-4 py-2.25 rounded-lg text-[13px] font-bold font-sans cursor-pointer transition-all duration-150 capitalize border ${form.frequency === f
                                        ? "gradient-brand text-white border-violet-600"
                                        : "bg-[#f6f8fa] dark:bg-[#0d1117] border-[#d0d7de] dark:border-[#30363d] text-[#656d76] dark:text-[#8b949e]"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {form.frequency === "custom" && (
                        <div className="flex gap-1.5 mt-2.5">
                            {WEEKDAY_LABELS.map((d, i) => (
                                <button
                                    key={d}
                                    onClick={() => toggleDay(i)}
                                    className={`flex-1 py-2.25 rounded-[7px] text-[11px] font-extrabold font-sans cursor-pointer transition-all duration-150 border ${form.customDays.includes(i)
                                            ? "gradient-brand text-white border-violet-600"
                                            : "bg-[#f6f8fa] dark:bg-[#0d1117] border-[#d0d7de] dark:border-[#30363d] text-[#656d76] dark:text-[#8b949e]"
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}
                </Field>

                {/* Start Date + Reminder */}
                <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Start Date">
                        <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                    </Field>
                    <Field label="Reminder (optional)">
                        <Input type="time" value={form.reminder} onChange={(e) => set("reminder", e.target.value)} />
                    </Field>
                </div>

                {/* Error */}
                {err && (
                    <div className="text-red-500 text-[13px] mb-4 px-3 py-2.5 bg-red-500/10 rounded-lg">
                        {err}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2.5 mt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.25 bg-transparent border border-[#d0d7de] dark:border-[#30363d] rounded-xl text-[#656d76] dark:text-[#8b949e] cursor-pointer font-semibold font-sans text-sm hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        className="flex-2 py-3.25 gradient-brand border-none rounded-xl text-white cursor-pointer font-extrabold font-sans text-sm"
                        style={{ boxShadow: "0 6px 20px rgba(124,58,237,.35)" }}
                    >
                        {habit ? "Save Changes" : "Create Habit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal