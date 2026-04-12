import React from 'react'

/**
 * Tag — coloured pill badge.
 * `color` must be a hex value; used for text and semi-transparent background.
 */
const Tag = ({ color, children }) => (
    <span
        className="text-[11px] font-bold px-[9px] py-[2px] rounded-full"
        style={{ color, background: `${color}20` }}
    >
        {children}
    </span>
);
export default Tag