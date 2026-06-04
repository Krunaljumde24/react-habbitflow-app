import React, { use, useCallback, useContext, useEffect, useState } from 'react'
// import Dashboard from './components/Dashboard';
import HabitsPage from './pages/HabitsPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Test from "./components/Test"
import { store } from './utils/commonUtils';
import MobileNav from './components/MobileNav';
import AuthPage from './pages/AuthPage';
import useAuth from './hooks/userAuth';
import Sidebar from "./components/Sidebar"
import { Outlet, useNavigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import AppContainer from './components/AppContainer'
import Loader from './components/ui/Loader'
import { AppContext } from './context/AppContext';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function App() {

    const [user, setUser] = useState(null)
    const { loggedInUser, isAuthenticated, setIsAuthenticated, checkAuth } = useContext(AuthContext)
    // const [loading, setLoading] = useState(true)
    const { appData, loading, setLoading } = useContext(AppContext)
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        const validateSession = async () => {
            let obj = localStorage.getItem('userData')
            const uData = JSON.parse(obj);
            console.log(uData);
            if (uData && uData.user) {
                let token = uData.user.auth.accessToken;
                try {
                    const result = await axios.get(`${baseUrl}/api/auth/verify`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                } catch (err) {
                    setAuthFail();
                }
            } else {
                setAuthFail();
            }
        }
        validateSession();
    }, [isAuthenticated])

    const setAuthFail = () => {
        setIsAuthenticated(false);
        navigate('/auth')
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0d1117] text-[#1c2128] dark:text-[#e6edf3] font-sans">
            <Toaster />
            {/* {(isAuthenticated && !loading && appData?.user) ? < AppContainer /> : <Loader />} */}
            < AppContainer />
            <Loader
                enabled={loading}
            />

        </div>
    )
}

export default App