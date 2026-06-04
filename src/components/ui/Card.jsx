
import React, { useEffect } from 'react'

function Card({ s }) {
    useEffect(() => {
    }, [])
    return (
        <div className={`text-center bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-2xl p-5`}>
            <div className="text-[22px] mb-1">
                {s.icon}
            </div>
            <div className="text-violet-500 text-[22px] font-extrabold leading-none">
                {s.val}
            </div>
            <div className="text-[#656d76] dark:text-[#8b949e] text-[11px] mt-1 font-semibold">
                {s.label}
            </div>
        </div>
    )
}

export default Card