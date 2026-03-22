import React from 'react'

const Card = ({ children, theme, style = {} }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", ...style }}>{children}</div>
);
export default Card