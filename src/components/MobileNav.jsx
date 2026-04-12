import { BarChart2, Calendar, Home, List, Settings } from "lucide-react";

const NAV = [
    { id: "dashboard", Icon: Home, label: "Dashboard" },
    { id: "habits", Icon: List, label: "Habits" },
    { id: "calendar", Icon: Calendar, label: "Calendar" },
    { id: "analytics", Icon: BarChart2, label: "Analytics" },
    { id: "settings", Icon: Settings, label: "Settings" },
];

function MobileNav({ active, setActive }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#161b22] border-t border-[#d0d7de] dark:border-[#30363d] flex z-[100] pb-[env(safe-area-inset-bottom,0px)]">
            {NAV.map(({ id, Icon: Ic, label }) => {
                const on = active === id;
                return (
                    <button
                        key={id}
                        onClick={() => setActive(id)}
                        className="flex-1 py-2.5 px-1 flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer font-sans transition-all duration-150"
                    >
                        <Ic size={20} color={on ? "#8b5cf6" : "#8b949e"} />
                        <span className={`text-[10px] ${on ? "text-violet-500 font-bold" : "text-[#8b949e] dark:text-[#8b949e] font-medium"}`}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default MobileNav;