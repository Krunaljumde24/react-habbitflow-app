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
function App() {

    const [user, setUser] = useState(null)
    const { loggedInUser, isAuthenticated, setIsAuthenticated, checkAuth } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth')
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 1500);
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0d1117] text-[#1c2128] dark:text-[#e6edf3] font-sans">
            <Toaster />
            {loading && <Loader />}
            {isAuthenticated && <AppContainer />}
            {/* <AppContainer /> */}
            {/* {!loading && !isAuthenticated && <AuthPage />} */}
        </div>
    )
}

export default App