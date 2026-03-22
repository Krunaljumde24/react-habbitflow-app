import { BarChart2, Calendar, Home, List, Settings } from "lucide-react";

const NAV = [
    { id: "dashboard", Icon: Home, label: "Dashboard" },
    { id: "habits", Icon: List, label: "Habits" },
    { id: "calendar", Icon: Calendar, label: "Calendar" },
    { id: "analytics", Icon: BarChart2, label: "Analytics" },
    { id: "settings", Icon: Settings, label: "Settings" },
];

function MobileNav({ active, setActive, theme }) {
    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: theme.bgCard, borderTop: `1px solid ${theme.border}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
            {NAV.map(({ id, Icon: Ic, label }) => {
                const on = active === id;
                return (
                    <button key={id} onClick={() => setActive(id)}
                        style={{ flex: 1, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                        <Ic size={20} color={on ? "#8b5cf6" : theme.textSub} />
                        <span style={{ fontSize: "10px", color: on ? "#8b5cf6" : theme.textSub, fontWeight: on ? "700" : "500" }}>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}


export default MobileNav;