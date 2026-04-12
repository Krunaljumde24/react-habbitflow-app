import React from 'react'
import {
    Home, List, Calendar, BarChart2, Settings,
    Sun, Moon,
} from "lucide-react";

const NAV = [
    { id: "dashboard", Icon: Home, label: "Dashboard" },
    { id: "habits", Icon: List, label: "Habits" },
    { id: "calendar", Icon: Calendar, label: "Calendar" },
    { id: "analytics", Icon: BarChart2, label: "Analytics" },
    { id: "settings", Icon: Settings, label: "Settings" },
];

function Sidebar({ active, setActive, darkMode, onToggleDark, user }) {
    return (
        <div className="w-56 bg-white dark:bg-[#161b22] border-r border-[#d0d7de] dark:border-[#30363d] flex flex-col h-screen fixed left-0 top-0 z-[100]">

            {/* Logo */}
            <div className="px-4 py-5 border-b border-[#d0d7de] dark:border-[#30363d]">
                <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] gradient-logo rounded-xl flex items-center justify-center text-lg shadow-logo flex-shrink-0">
                        🔥
                    </div>
                    <div>
                        <div className="text-[#1c2128] dark:text-[#e6edf3] font-extrabold text-base tracking-tight">HabitFlow</div>
                        <div className="text-[#656d76] dark:text-[#8b949e] text-[11px]">Track your progress</div>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
                {NAV.map(({ id, Icon: Ic, label }) => {
                    const on = active === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActive(id)}
                            className={`
                                w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px]
                                border-none cursor-pointer font-sans text-sm transition-all duration-150
                                border-l-[3px]
                                ${on
                                    ? "bg-violet-600/15 text-violet-500 font-bold border-l-violet-600"
                                    : "bg-transparent text-[#656d76] dark:text-[#8b949e] font-medium border-l-transparent hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"
                                }
                            `}
                        >
                            <Ic size={18} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#d0d7de] dark:border-[#30363d] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full gradient-logo flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0">
                    {user.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[#1c2128] dark:text-[#e6edf3] font-bold text-[13px] truncate">{user.name}</div>
                </div>
                <button
                    onClick={onToggleDark}
                    className="bg-transparent border-none cursor-pointer text-[#656d76] dark:text-[#8b949e] p-1 flex items-center hover:text-[#1c2128] dark:hover:text-[#e6edf3] transition-colors"
                >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </div>
    );
}

export default Sidebar