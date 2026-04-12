import React from 'react'

const variants = {
    primary: "gradient-brand text-white shadow-accent",
    danger: "bg-red-500/10 text-red-500 border border-red-500/30",
    ghost: "bg-transparent text-[#8b949e] border border-[#30363d]",
};

const Btn = ({ children, onClick, variant = "ghost", className = "", disabled, ...rest }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            inline-flex items-center justify-center gap-1.5
            px-4 py-2.5 rounded-[10px] text-sm font-semibold
            transition-all duration-150 font-sans
            ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            ${variants[variant] ?? variants.ghost}
            ${className}
        `}
        {...rest}
    >
        {children}
    </button>
);
export default Btn