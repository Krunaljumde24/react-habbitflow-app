import React, { useState } from 'react'
import { todayStr } from '../utils/commonUtils'
import Field from './ui/Field';
import Input from './ui/Input';
import { X } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

function HabitModal({ habit, onSave, onClose, theme }) {
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
        ...f, customDays: f.customDays.includes(i) ? f.customDays.filter((d) => d !== i) : [...f.customDays, i],
    }));

    const save = () => {
        if (!form.name.trim()) { setErr("Habit name is required."); return; }
        onSave(form);
    };

    const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(6px)" };
    const modal = { background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "500px", maxHeight: "92vh", overflowY: "auto", boxShadow: theme.shadow };

    return (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div style={modal}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ color: theme.text, margin: 0, fontSize: "20px", fontWeight: "800" }}>{habit ? "Edit Habit" : "New Habit ✨"}</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSub, padding: "4px", display: "flex" }}>
                        <X size={20} /></button>
                </div>

                {/* Name */}
                <Field label="Habit Name *">
                    <Input theme={theme} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Morning Run, Read 30 mins…" autoFocus />
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional notes…" rows={2}
                        style={{ width: "100%", padding: "11px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = "#7c3aed")} onBlur={(e) => (e.target.style.borderColor = theme.border)}
                    />
                </Field>

                {/* Category */}
                <Field label="Category">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                        {CATEGORIES.map((cat) => (
                            <button key={cat.id} onClick={() => set("category", cat.id)}
                                style={{ padding: "10px 4px", background: form.category === cat.id ? `${cat.color}22` : theme.bgInput, border: `1px solid ${form.category === cat.id ? cat.color : theme.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "all 0.15s" }}>
                                <span style={{ fontSize: "18px" }}>{cat.emoji}</span>
                                <span style={{ fontSize: "10px", fontWeight: "700", color: form.category === cat.id ? cat.color : theme.textSub }}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </Field>

                {/* Frequency */}
                <Field label="Frequency">
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["daily", "weekdays", "weekends", "custom"].map((f) => (
                            <button key={f} onClick={() => set("frequency", f)}
                                style={{ padding: "9px 16px", background: form.frequency === f ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : theme.bgInput, border: `1px solid ${form.frequency === f ? "#7c3aed" : theme.border}`, borderRadius: "8px", color: form.frequency === f ? "#fff" : theme.textSub, cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", transition: "all 0.15s", textTransform: "capitalize" }}>
                                {f}
                            </button>
                        ))}
                    </div>
                    {form.frequency === "custom" && (
                        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                            {WEEKDAY_LABELS.map((d, i) => (
                                <button key={d} onClick={() => toggleDay(i)}
                                    style={{ flex: 1, padding: "9px 0", background: form.customDays.includes(i) ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : theme.bgInput, border: `1px solid ${form.customDays.includes(i) ? "#7c3aed" : theme.border}`, borderRadius: "7px", color: form.customDays.includes(i) ? "#fff" : theme.textSub, cursor: "pointer", fontSize: "11px", fontWeight: "800", fontFamily: "inherit" }}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {/* Start Date */}
                    <Field label="Start Date">
                        <Input theme={theme} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                    </Field>
                    {/* Reminder */}
                    <Field label="Reminder (optional)">
                        <Input theme={theme} type="time" value={form.reminder} onChange={(e) => set("reminder", e.target.value)} />
                    </Field>
                </div>

                {err && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", padding: "10px 12px", background: "rgba(239,68,68,.1)", borderRadius: "8px" }}>{err}</div>}

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.textSub, cursor: "pointer", fontWeight: "600", fontFamily: "inherit", fontSize: "14px" }}>Cancel</button>
                    <button onClick={save} style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", cursor: "pointer", fontWeight: "800", fontFamily: "inherit", fontSize: "14px", boxShadow: "0 6px 20px rgba(124,58,237,.35)" }}>
                        {habit ? "Save Changes" : "Create Habit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal