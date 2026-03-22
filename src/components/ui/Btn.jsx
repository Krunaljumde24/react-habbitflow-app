import React from 'react'

const Btn = ({ children, onClick, variant = "ghost", style = {}, disabled, ...rest }) => {
    const base = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "none",
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        fontSize: "14px", fontWeight: "600", transition: "all 0.18s", ...style,
    };
    const variants = {
        primary: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", boxShadow: "0 4px 14px rgba(124,58,237,0.35)" },
        danger: { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
        ghost: { background: "transparent", color: "#8b949e", border: "1px solid #30363d" },
    };
    return <button onClick={onClick} disabled={disabled} style={{ ...base, ...(variants[variant] ?? {}), ...style }} {...rest}>{children}</button>;
};
export default Btn