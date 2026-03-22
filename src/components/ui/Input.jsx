import React from 'react'

const Input = ({ theme, ...props }) => (
    <input
        style={{ width: "100%", padding: "11px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
        onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
        onBlur={(e) => (e.target.style.borderColor = theme.border)}
        {...props}
    />
);
export default Input