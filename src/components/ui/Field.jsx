import React from 'react'

const Field = ({ label, children, style = {} }) => (
    <div style={{ marginBottom: "16px", ...style }}>
        {label && <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#8b949e", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
        {children}
    </div>
);

export default Field