import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import { Outlet } from 'react-router';
import MobileNav from './MobileNav';
import { AuthContext } from '../context/AuthContext';

const AppContainer = () => {

    const [isMobile, setMobile] = useState(window.innerWidth < 768);
    const { isAuthenticated } = useContext(AuthContext)

    useEffect(() => {
        const onResize = () => setMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <>
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
        </>
    )
}

export default AppContainer