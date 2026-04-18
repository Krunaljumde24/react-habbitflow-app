import React, { createContext, useEffect, useState } from 'react'
import { store } from '../utils/commonUtils';
import useAuth from '../hooks/userAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(null)

    const [view, setView] = useState('')

    // Load from localStorage on refresh
    useEffect(() => {
        const usr = store.get("currentUser");
        setLoggedInUser(usr)
    }, [])

    const loginContext = (userData) => {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setLoggedInUser(userData);
    };

    const logoutContext = () => {
        localStorage.removeItem("currentUser");
        setLoggedInUser(null);
    };

    const getUserDetails = () => {
        return JSON.parse(localStorage.getItem("currentUser"));
    }

    const isAuthenticated = !!loggedInUser;

    return (
        <AuthContext.Provider value={{ loggedInUser, loginContext, logoutContext, getUserDetails, isAuthenticated, view, setView }}>
            {children}
        </AuthContext.Provider>
    )
}
