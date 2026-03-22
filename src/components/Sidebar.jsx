import React from 'react'
import {
    Home, List, Calendar, BarChart2, Settings,
    Plus, Check, X, Flame, Trash2, Edit2,
    Sun, Moon, LogOut, ChevronLeft, ChevronRight,
    Bell, Download, Trophy,
} from "lucide-react";

const NAV = [
    { id: "dashboard", Icon: Home, label: "Dashboard" },
    { id: "habits", Icon: List, label: "Habits" },
    { id: "calendar", Icon: Calendar, label: "Calendar" },
    { id: "analytics", Icon: BarChart2, label: "Analytics" },
    { id: "settings", Icon: Settings, label: "Settings" },
];

function Sidebar({ active, setActive, darkMode, onToggleDark, user, theme }) {
    return (
        <div style={{ width: "224px", background: theme.bgCard, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
            {/* Logo */}
            <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 12px rgba(124,58,237,.4)" }}>🔥</div>
                    <div>
                        <div style={{ color: theme.text, fontWeight: "800", fontSize: "16px", letterSpacing: "-0.3px" }}>HabitFlow</div>
                        <div style={{ color: theme.textSub, fontSize: "11px" }}>Track your progress</div>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {NAV.map(({ id, Icon: Ic, label }) => {
                    const on = active === id;
                    return (
                        <button key={id} onClick={() => setActive(id)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: on ? "700" : "500", transition: "all 0.15s",
                                background: on ? "rgba(124,58,237,.15)" : "transparent",
                                color: on ? "#8b5cf6" : theme.textSub,
                                borderLeft: on ? "3px solid #7c3aed" : "3px solid transparent",
                            }}>
                            <Ic size={18} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "800", flexShrink: 0 }}>
                    {user.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: theme.text, fontWeight: "700", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                </div>
                <button onClick={onToggleDark} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSub, padding: "4px", display: "flex" }}>
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </div>
    );
}

export default Sidebar