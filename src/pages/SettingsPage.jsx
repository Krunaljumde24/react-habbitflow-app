import React, { useState } from 'react'
import Card from '../components/ui/Card';
import { Download, LogOut, Moon, Sun } from 'lucide-react';

function SettingsPage({ user, darkMode, onToggleDark, onLogout, habits, logs, theme }) {
    const [msg, setMsg] = useState("");

    const download = (content, filename, type) => {
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([content], { type })), download: filename });
        a.click(); URL.revokeObjectURL(a.href);
    };

    const exportJSON = () => {
        download(JSON.stringify({ user: { name: user.name, email: user.email }, habits, logs, exportedAt: new Date().toISOString() }, null, 2), "habitflow-export.json", "application/json");
        setMsg("JSON exported!"); setTimeout(() => setMsg(""), 2500);
    };

    const exportCSV = () => {
        const rows = [["Habit", "Category", "Date", "Completed"]];
        logs.forEach((l) => { const h = habits.find((x) => x.id === l.habitId); if (h) rows.push([h.name, h.category, l.date, l.completed]); });
        download(rows.map((r) => r.join(",")).join("\n"), "habitflow-export.csv", "text/csv");
        setMsg("CSV exported!"); setTimeout(() => setMsg(""), 2500);
    };

    const Row = ({ label, value }) => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.textSub, fontSize: "14px" }}>{label}</span>
            <span style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>{value}</span>
        </div>
    );

    return (
        <div>
            <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: "800", margin: "0 0 24px" }}>Settings</h1>

            {/* Profile */}
            <Card theme={theme} style={{ marginBottom: "14px" }}>
                <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Profile</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "22px", fontWeight: "800", color: "#fff" }}>
                        {user.name[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ color: theme.text, fontWeight: "800", fontSize: "17px" }}>{user.name}</div>
                        <div style={{ color: theme.textSub, fontSize: "13px" }}>{user.email}</div>
                    </div>
                </div>
            </Card>

            {/* Appearance */}
            <Card theme={theme} style={{ marginBottom: "14px" }}>
                <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Appearance</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {darkMode ? <Moon size={18} color="#8b5cf6" /> : <Sun size={18} color="#f59e0b" />}
                    <div>
                            <div style={{ color: theme.text, fontWeight: "700", fontSize: "14px" }}>Dark Mode</div>
                            <div style={{ color: theme.textSub, fontSize: "12px" }}>{darkMode ? "Currently on" : "Currently off"}</div>
                        </div>
                    </div>
                    {/* Toggle switch */}
                    <div onClick={onToggleDark} style={{ width: "50px", height: "27px", borderRadius: "99px", background: darkMode ? "#7c3aed" : theme.bgHover, border: `1px solid ${theme.border}`, cursor: "pointer", position: "relative", transition: "background 0.25s" }}>
                        <div style={{ position: "absolute", top: "3px", left: darkMode ? "25px" : "3px", width: "19px", height: "19px", borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
                    </div>
                </div>
            </Card>

            {/* Data Export */}
            <Card theme={theme} style={{ marginBottom: "14px" }}>
                <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 16px" }}>Export Data</h3>
                {msg && <div style={{ color: "#22c55e", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>✅ {msg}</div>}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={exportJSON} style={{ flex: 1, padding: "12px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, cursor: "pointer", fontWeight: "700", fontSize: "13px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Download size={14} /> JSON
                    </button>
                    <button onClick={exportCSV} style={{ flex: 1, padding: "12px", background: theme.bgHover, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, cursor: "pointer", fontWeight: "700", fontSize: "13px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Download size={14} /> CSV
                    </button>
                </div>
            </Card>

            {/* Stats */}
            <Card theme={theme} style={{ marginBottom: "20px" }}>
                <h3 style={{ color: theme.text, fontWeight: "800", fontSize: "15px", margin: "0 0 4px" }}>Account Stats</h3>
                <Row label="Habits created" value={habits.length} />
                <Row label="Log entries" value={logs.length} />
                <Row label="Completed sessions" value={logs.filter((l) => l.completed).length} />
                <Row label="Member since" value={new Date(user.createdAt ?? Date.now()).toLocaleDateString()} />
            </Card>

            {/* Logout */}
            <button onClick={onLogout} style={{ width: "100%", padding: "15px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: "14px", color: "#ef4444", cursor: "pointer", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    );
}

export default SettingsPage