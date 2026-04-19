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
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
function App() {

    const [modal, setModal] = useState(null); // null | "new" | habitObj
    const [isMobile, setMobile] = useState(window.innerWidth < 768);

    const [darkMode, setDarkMode] = useState(true)
    const [user, setUser] = useState(null)
    const { getUserDetails , loggedInUser} = useContext(AuthContext)

    useEffect(() => {

        // Resize window based on viewport
        const onResize = () => setMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);

        // load user from context or login
        const u = getUserDetails()
        setUser(u)

        return () => window.removeEventListener("resize", onResize);
    }, [loggedInUser])

    if (!user) return <AuthPage />
    else {
        return (
            <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0d1117] text-[#1c2128] dark:text-[#e6edf3] font-sans">
                <Toaster />
                {!isMobile && (
                    <Sidebar />
                )}
                <main className={
                    isMobile
                        ? "px-4 pt-5 pb-24"
                        : "ml-56 p-9 max-w-210"
                }>
                    <Outlet />
                </main>
                {isMobile && <MobileNav />}
            </div>
        )
    }

}

export default App