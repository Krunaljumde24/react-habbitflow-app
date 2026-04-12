import React from 'react'

const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-2xl p-5 ${className}`}>
        {children}
    </div>
);
export default Card