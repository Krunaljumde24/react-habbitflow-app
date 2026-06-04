import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { getHabbitsByUserId, getHabbitLogsByUserId } from '../service/AppService.js'

const AppContext = createContext();


const AppProvider = ({ children }) => {


    const [loading, setLoading] = useState(false)
    const [appData, setAppData] = useState(null)

    const [view, setView] = useState('')
    const [habbits, setHabbits] = useState([])
    const [logs, setLogs] = useState([])

    useEffect(() => {
        // console.log(appData);

        // if (appData != undefined) {
        //     localStorage.setItem("userData", JSON.stringify(appData))
        // }
    }, [appData])


    return (
        <AppContext.Provider value={{ habbits, setHabbits, view, setView, logs, setLogs, appData, setAppData, loading, setLoading }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }