/**
 * HabitFlow — Full-Stack Habit Tracker
 * Frontend: React + Recharts + Lucide Icons
 * Persistence: localStorage (swap fetch() calls for real API in production)
 *
 * Architecture:
 *   App → AuthPage | MainLayout → Dashboard | HabitsPage | CalendarPage | AnalyticsPage | SettingsPage
 */

import { useState, useEffect, useCallback } from "react";
import HabitsPage from "./pages/HabitsPage";
import AuthPage from "./pages/AuthPage";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import HabitModal from "./components/HabitModal";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";

import { uid, store, hashPw } from "./utils/commonUtils";
import Dashboard from "./components/Dashboard";

import "./App.css";
import { Toaster } from "react-hot-toast";

export default function _App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState("dashboard");

  const [isMobile, setMobile] = useState(window.innerWidth < 768);

  /* ─── Apply dark class to <html> ─────────────────── */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* ─── Bootstrap ─────────────────────────────────── */
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    // Restore dark mode pref
    const dm = store.get("darkMode");
    if (dm !== null) setDarkMode(dm);



    
  }, []);



  /* ─── Auth ───────────────────────────────────────── */
  const handleAuth = (u) => {
    setUser(u);
    loadData(u.id);
  };
  const handleLogout = () => {
    store.remove("currentUser");
    setUser(null);
    // setHabits([]);
    setLogs([]);
  };
  const toggleDark = () => setDarkMode((d) => { store.set("darkMode", !d); return !d; });

  /* ─── Habit CRUD ─────────────────────────────────── */
  const saveHabit = useCallback((formData) => {
    const all = store.get("habits") ?? [];
    let updated;
    if (modal === "new") {
      updated = [...all, { id: uid(), userId: user.id, ...formData, createdAt: new Date().toISOString() }];
    } else {
      updated = all.map((h) => h.id === modal.id ? { ...modal, ...formData } : h);
    }
    store.set("habits", updated);
    setHabits(updated.filter((h) => h.userId === user.id));
    setModal(null);
  }, [modal, user]);

  const deleteHabit = useCallback((habitId) => {
    if (!window.confirm("Delete this habit and all its history?")) return;
    const allH = (store.get("habits") ?? []).filter((h) => h.id !== habitId);
    const allL = (store.get("habitLogs") ?? []).filter((l) => l.habitId !== habitId);
    store.set("habits", allH); store.set("habitLogs", allL);
    setHabits(allH.filter((h) => h.userId === user.id));
    setLogs(allL.filter((l) => l.userId === user.id));
  }, [user]);



  /* ─── Render ─────────────────────────────────────── */
  if (!user) return <AuthPage onAuth={handleAuth} />;

  // const views = {
  //   dashboard: <Dashboard habits={habits} logs={logs} user={user} onToggle={toggleLog} onAddHabit={() => setModal("new")} />,
  //   habits: <HabitsPage habits={habits} logs={logs} onAdd={() => setModal("new")} onEdit={(h) => setModal(h)} onDelete={deleteHabit} onToggle={toggleLog} />,
  //   calendar: <CalendarPage habits={habits} logs={logs} onToggle={toggleLog} />,
  //   analytics: <AnalyticsPage habits={habits} logs={logs} />,
  //   settings: <SettingsPage user={user} darkMode={darkMode} onToggleDark={toggleDark} onLogout={handleLogout} habits={habits} logs={logs} />,
  // };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0d1117] text-[#1c2128] dark:text-[#e6edf3] font-sans">
      {!isMobile && (
        <Sidebar active={view} setActive={setView} darkMode={darkMode} onToggleDark={toggleDark} user={user} />
      )}

      <main className={
        isMobile
          ? "px-4 pt-5 pb-24"
          : "ml-56 p-9 max-w-210"
      }>
        {views[view] ?? null}
      </main>

      {isMobile && <MobileNav active={view} setActive={setView} />}

      {modal !== null && (
        <HabitModal
          habit={modal === "new" ? null : modal}
          onSave={saveHabit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
