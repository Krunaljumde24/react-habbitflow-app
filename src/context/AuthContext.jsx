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

    const checkAuth = async () => {
        const obj = localStorage.getItem("userData");
        console.log(obj);

        if (obj && obj?.user) {
            const uData = JSON.parse(obj);;
            console.log(uData);
            let token = uData.auth.accessToken;
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
                console.log(error);
                toast.error('Session expired, Please re-login.')
                localStorage.removeItem("userData");
                setIsAuthenticated(false)
                return false;
            }
        } else {

        }
    }

    const loginContext = (userData) => {
        console.log(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        setLoggedInUser(userData.user);
    };

    const logoutContext = () => {
        localStorage.removeItem("userData");
        setLoggedInUser(null);
        setIsAuthenticated(false)
    };

    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser, logoutContext, isAuthenticated, setIsAuthenticated, checkAuth, loginContext }}>
            {children}
        </AuthContext.Provider>
    )
}
