import React from 'react'

const Field = ({ label, children, className = "" }) => (
    <div className={`mb-4 ${className}`}>
        {label && (
            <label className="block text-xs font-semibold text-[#656d76] dark:text-[#8b949e] mb-1.5 uppercase tracking-wide">
                {label}
            </label>
        )}
        {children}
    </div>
);

export default Field