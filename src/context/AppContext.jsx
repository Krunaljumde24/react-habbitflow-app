import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';

const AppContext = createContext();


const AppProvider = ({ children }) => {
    const { } = useContext(AuthContext)
    const [view, setView] = useState('')
    const [habbits, setHabbits] = useState([])
    const [logs, setLogs] = useState([])

    useEffect(() => {

        if (Array.isArray(habbits) && habbits.length > 0) {
            console.log(habbits);

            var habitIds = [];
            habbits.map((h) => habitIds.push(h.id));
            console.log(habitIds);

        }

    }, [habbits])

    return (
        <AppContext.Provider value={{ habbits, setHabbits, view, setView, logs, setLogs }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }