import { X } from 'lucide-react'
import React from 'react'

function DeleteModal({ onClose }) {

    const deleteHabit = () => {
        console.log('delete habbit ');
        onClose(false)
    }

    return (
        <div
            className="fixed inset-0 bg-black/75 z-1000 flex items-center justify-center p-4 backdrop-blur-[6px]"
            onClick={(e) => e.target === e.currentTarget && onClose(false)}
        >

            {/* Modal panel */}
            <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-[20px] p-7 w-full max-w-125 max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[#1c2128] dark:text-[#e6edf3] m-0 text-xl font-extrabold">
                        Are you sure you want to delete habbit?
                    </h2>

                    <button
                        onClick={onClose}
                        className="bg-transparent border-none cursor-pointer text-[#656d76] dark:text-[#8b949e] p-1 flex hover:text-[#1c2128] dark:hover:text-[#e6edf3] transition-colors"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Actions */}
                <div className="flex gap-2.5 mt-1">
                    <button
                        onClick={() => onClose(false)}
                        className="flex-1 py-3.25 bg-transparent border border-[#d0d7de] dark:border-[#30363d] rounded-xl text-[#656d76] dark:text-[#8b949e] cursor-pointer font-semibold font-sans text-sm hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteHabit()}
                        className="flex-2 py-3.25 gradient-brand border-none rounded-xl text-white cursor-pointer font-extrabold font-sans text-sm"
                        style={{ boxShadow: "0 6px 20px rgba(124,58,237,.35)" }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div >
    )
}

export default DeleteModal