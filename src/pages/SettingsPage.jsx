import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/ui/Card';
import { Download, LogOut, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx'
import { AppContext } from '../context/AppContext';
import { getInitials } from '../utils/commonUtils.js';

function SettingsPage() {
    const [msg, setMsg] = useState("");
    const { habbits, logs, appData } = useContext(AppContext)
    const { loggedInUser, logoutContext } = useContext(AuthContext)

    const [user, setUser] = useState({
        name: '',
        email: '',
    })
    const [darkMode, setDarkMode] = useState(true)

    const download = (content, filename, type) => {
        const a = Object.assign(document.createElement("a"), {
            href: URL.createObjectURL(new Blob([content], { type })),
            download: filename,
        });
        a.click(); URL.revokeObjectURL(a.href);
    };

    const exportJSON = () => {
        download(
            JSON.stringify({ user: { name: user.name, email: user.email }, habbits, logs, exportedAt: new Date().toISOString() }, null, 2),
            "habitflow-export.json", "application/json"
        );
        setMsg("JSON exported!"); setTimeout(() => setMsg(""), 2500);
    };

    const exportCSV = () => {
        const rows = [["Habit", "Category", "Date", "Completed"]];
        logs.forEach((l) => { const h = habbits.find((x) => x.id === l.habitId); if (h) rows.push([h.name, h.category, l.date, l.completed]); });
        download(rows.map((r) => r.join(",")).join("\n"), "habitflow-export.csv", "text/csv");
        setMsg("CSV exported!"); setTimeout(() => setMsg(""), 2500);
    };

    const StatRow = ({ label, value }) => (
        <div className="flex justify-between py-3 border-b border-[#d0d7de] dark:border-[#30363d]">
            <span className="text-[#656d76] dark:text-[#8b949e] text-sm">{label}</span>
            <span className="text-[#1c2128] dark:text-[#e6edf3] font-bold text-sm">{value}</span>
        </div>
    );

    useEffect(() => {
        

    }, [])
    return (
        <div>
            <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-2xl font-extrabold m-0 mb-6">Settings</h1>

            {/* Profile */}
            <Card className="mb-3.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4">Profile</h3>
                <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full gradient-logo flex items-center justify-center shrink-0 text-[22px] font-extrabold text-white">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <div className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[17px]">{user.name}</div>
                        <div className="text-[#656d76] dark:text-[#8b949e] text-[13px]">{user.email}</div>
                    </div>
                </div>
            </Card>

            {/* Appearance */}
            <Card className="mb-3.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4">Appearance</h3>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2.5 items-center">
                        {darkMode ? <Moon size={18} color="#8b5cf6" /> : <Sun size={18} color="#f59e0b" />}
                        <div>
                            <div className="text-[#1c2128] dark:text-[#e6edf3] font-bold text-sm">Dark Mode</div>
                            <div className="text-[#656d76] dark:text-[#8b949e] text-xs">{darkMode ? "Currently on" : "Currently off"}</div>
                        </div>
                    </div>
                    {/* Toggle switch */}
                    <div
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-12.5 h-6.75 rounded-full border border-[#d0d7de] dark:border-[#30363d] cursor-pointer relative transition-colors duration-250"
                        style={{ background: darkMode ? "#7c3aed" : "#f6f8fa" }}
                    >
                        <div
                            className="absolute top-0.75 w-4.75 h-4.75 rounded-full bg-white transition-[left] duration-250"
                            style={{ left: darkMode ? "25px" : "3px", boxShadow: "0 1px 4px rgba(0,0,0,.35)" }}
                        />
                    </div>
                </div>
            </Card>

            {/* Data Export */}
            <Card className="mb-3.5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-4">Export Data</h3>
                {msg && (
                    <div className="text-green-500 text-[13px] mb-3 font-semibold">✅ {msg}</div>
                )}
                <div className="flex gap-2.5">
                    <button
                        onClick={exportJSON}
                        className="flex-1 py-3 bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] cursor-pointer font-bold text-[13px] font-sans flex items-center justify-center gap-1.5 hover:bg-[#e8eaed] dark:hover:bg-[#30363d] transition-colors"
                    >
                        <Download size={14} /> JSON
                    </button>
                    <button
                        onClick={exportCSV}
                        className="flex-1 py-3 bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] cursor-pointer font-bold text-[13px] font-sans flex items-center justify-center gap-1.5 hover:bg-[#e8eaed] dark:hover:bg-[#30363d] transition-colors"
                    >
                        <Download size={14} /> CSV
                    </button>
                </div>
            </Card>

            {/* Stats */}
            <Card className="mb-5">
                <h3 className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-[15px] m-0 mb-1">Account Stats</h3>
                <StatRow label="Habits created" value={habbits.length} />
                <StatRow label="Log entries" value={logs.length} />
                <StatRow label="Completed sessions" value={logs.filter((l) => l.completed).length} />
                <StatRow label="Member since" value={new Date(user.createdAt ?? Date.now()).toLocaleDateString()} />
            </Card>

            {/* Logout */}
            <button
                onClick={() => logoutContext()}
                className="w-full py-3.75 bg-red-500/8 border border-red-500/30 rounded-2xl text-red-500 cursor-pointer font-extrabold text-[15px] font-sans flex items-center justify-center gap-2 hover:bg-red-500/15 transition-colors"
            >
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    );
}

export default SettingsPage