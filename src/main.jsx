import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
import toast, { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Dashboard from './components/Dashboard.jsx'
import Test from './components/Test.jsx'
import HabitsPage from './pages/HabitsPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/habits',
        element: <HabitsPage />
      },
      {
        path: '/calendar',
        element: <CalendarPage />
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '/test',
        element: <Test />
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
