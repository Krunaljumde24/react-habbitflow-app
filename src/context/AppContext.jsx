import React, { createContext, useState } from 'react'

const AppContext = createContext();


const AppProvider = ({ children }) => {
    const [view, setView] = useState('')
    const [habbits, setHabbits] = useState([])
    const [logs, setLogs] = useState([
        // {
        //     "id": "kwnkpw3noi9mn0kwhfm",
        //     "habitId": "yt5qktzy8imn0kqsha",
        //     "date": "2026-03-21",
        //     "completed": false,
        //     "userId": "demo-001"
        // },
        // {
        //     "id": "tqimnowy41mn0mb6t1",
        //     "habitId": "c5vbxxh8bfmn0kx9qz",
        //     "date": "2026-03-21",
        //     "completed": false,
        //     "userId": "demo-001"
        // },
        // {
        //     "id": "pwb9rjwftmn0mb7d0",
        //     "habitId": "teu2caqleimn0mazjr",
        //     "date": "2026-03-21",
        //     "completed": true,
        //     "userId": "demo-001"
        // }
        ])

    return (
        <AppContext.Provider value={{ habbits, setHabbits, view, setView, logs, setLogs }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }