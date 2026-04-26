import React, { createContext, useEffect, useState } from 'react'
import { store } from '../utils/commonUtils';
import useAuth from '../hooks/userAuth';
import axios from 'axios';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        const obj = localStorage.getItem("currentUser");
        if (obj) {
            const u = JSON.parse(obj);;
            let token = u.accessToken;
            try {
                const result = await axios.get(`${baseUrl}/api/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setIsAuthenticated(true)
                setLoggedInUser(u)
                return await u;
            } catch (error) {
                toast.error('Session expired, Please re-login.')
                localStorage.removeItem("currentUser");
                setIsAuthenticated(false)
                return false;
            }
        }
    }

    const loginContext = (userData) => {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setLoggedInUser(userData);
    };

    const logoutContext = () => {
        localStorage.removeItem("currentUser");
        setLoggedInUser(null);
        setIsAuthenticated(false)
    };

    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser, logoutContext, isAuthenticated, setIsAuthenticated, checkAuth, loginContext }}>
            {children}
        </AuthContext.Provider>
    )
}
