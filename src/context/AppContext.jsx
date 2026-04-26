import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { getHabbitsByUserId, getHabbitLogsByUserId } from '../service/AppService.js'

const AppContext = createContext();


const AppProvider = ({ children }) => {


    const [loading, setLoading] = useState(false)

    const [appData, setAppData] = useState({
        user: null,
        habits: [],
        logs: []
    })

    const [view, setView] = useState('')
    const [habbits, setHabbits] = useState([])
    const [logs, setLogs] = useState([])

    useEffect(() => {
        if (Array.isArray(habbits) && habbits.length > 0) {
            var habitIds = [];
            habbits.map((h) => habitIds.push(h.id));
        }

    }, [habbits])


    const initializeData = async (userId) => {
        const hData = await getHabbitsByUserId(userId);
        console.log(hData);
        const hlData = await getHabbitLogsByUserId(userId)
        console.log(hlData);
    }

    return (
        <AppContext.Provider value={{ habbits, setHabbits, view, setView, logs, setLogs, initializeData }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }