import React from 'react'

const Tag = ({ color, children }) => (
    <span style={{ fontSize: "11px", fontWeight: "700", color, background: `${color}20`, padding: "2px 9px", borderRadius: "99px" }}>{children}</span>
);
export default Tag