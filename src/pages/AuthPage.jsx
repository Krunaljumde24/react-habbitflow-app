import { useContext, useEffect, useState } from "react";
import { hashPw, store } from "../utils/commonUtils";
import Login from "../components/Login.jsx"
import SignUp from "../components/SignUp.jsx"
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext.jsx";


function AuthPage() {

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loginTab, setLoginTab] = useState(true)
    const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));


    const { isAuthenticated, checkAuth } = useContext(AuthContext)

    const { loading, setLoading } = useContext(AppContext)
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated])

    return (
        <div className="min-h-screen gradient-auth-bg flex items-center justify-center p-5 font-sans">

            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[25%] -right-[15%] w-150 h-150 rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%)" }} />
                <div className="absolute -bottom-[20%] -left-[10%] w-100 h-100 rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)" }} />
            </div>

            <div className="w-full max-w-105 relative">

                {/* Brand */}
                <div className="text-center mb-9">
                    <div className="inline-flex items-center justify-center w-17 h-17 gradient-logo rounded-[20px] mb-4 text-[30px]"
                        style={{ boxShadow: "0 12px 40px rgba(124,58,237,.45)" }}>
                        🔥
                    </div>
                    <h1 className="text-[#e6edf3] text-[30px] font-extrabold m-0 mb-1.5 tracking-tight">HabitFlow</h1>
                    <p className="text-[#8b949e] text-[15px] m-0">Build habits that last a lifetime.</p>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-[20px] p-8"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>

                    {/* Tab switcher */}
                    <div className="flex bg-[#0d1117] rounded-xl p-1 mb-7">
                        <button
                            key={1}
                            onClick={() => {
                                setLoginTab(!loginTab);
                                setError("");
                            }}
                            disabled={loginTab}
                            className={`flex-1 py-2.5 rounded-lg border-none cursor-pointer font-bold text-sm font-sans transition-all duration-200 ${loginTab
                                ? "gradient-brand text-white"
                                : "bg-transparent text-[#8b949e]"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            key={2}
                            onClick={() => {
                                setLoginTab(!loginTab);
                                setError("");
                            }}
                            disabled={!loginTab}
                            className={`flex-1 py-2.5 rounded-lg border-none cursor-pointer font-bold text-sm font-sans transition-all duration-200 ${!loginTab
                                ? "gradient-brand text-white"
                                : "bg-transparent text-[#8b949e]"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>


                    {loginTab ? <Login
                        form={form}
                        serForm={setForm}
                        handle={handle}
                        error={error}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                    /> : <SignUp
                        form={form}
                        serForm={setForm}
                        handle={handle}
                        error={error}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                    />}

                    {/* Demo credentials */}
                    <div className="mt-5 px-4 py-3.5 rounded-[10px] border"
                        style={{ background: "rgba(124,58,237,.1)", borderColor: "rgba(124,58,237,.25)" }}>
                        <p className="text-violet-500 text-[11px] font-bold m-0 mb-1.5 uppercase tracking-[0.08em]">🔑 Demo Account</p>
                        <p className="text-violet-300 text-[13px] m-0">demo@habitflow.com · demo123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;




