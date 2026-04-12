import React from 'react'

const Input = ({ ...props }) => (
    <input
        className="w-full px-3.5 py-2.5 bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-[10px] text-[#1c2128] dark:text-[#e6edf3] text-sm font-sans outline-none box-border [color-scheme:dark] focus:border-violet-600 transition-colors"
        {...props}
    />
);
export default Input