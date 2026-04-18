import { useState } from "react";
import { hashPw, store } from "../utils/commonUtils";
import { login } from "../service/AuthService";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

export default function Login({ onAuth, error, setError, loading, setLoading }) {

    const [isLogin, setIsLogin] = useState(true);

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const inputCls = "w-full px-3.5 py-3 bg-[#0d1117] border border-[#30363d] rounded-[10px] text-[#e6edf3] text-sm font-sans outline-none box-border focus:border-violet-600 transition-colors";

    const submit = async () => {
        setError(""); setLoading(true);
        const status = await login(user);
        console.log(status);
        
        if (status) {
            toast.success('Login Successful.')


            let safe = {
                "id": "0afac0e9-b9c7-4a27-9bea-6c2f66e317c6",
                "name": "Krunal Jumde",
                "email": "Krunal@habitflow.com",
                "createdAt": "2026-04-17T05:26:52.799Z"
            }
            store.set("currentUser", safe);
            onAuth(safe)
        } else {
            toast.error('Invalid username or password');
            setError("Invalid email or password.");
            setLoading(false);
            return;
        }

    }
    return (
        <div>
            <div className="mb-4">
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Email</label>
                <input
                    className={inputCls}
                    value={user.email}
                    onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    type="email"
                />
            </div>

            <div className={error ? "mb-3.5" : "mb-6"}>
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
                <input
                    className={inputCls}
                    value={user.password}
                    onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    type="password"
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                />
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className={`w-full py-3.5 border-none rounded-xl text-white font-extrabold text-[15px] font-sans transition-all duration-200 tracking-[0.01em] ${loading ? "bg-gray-600 cursor-not-allowed" : "gradient-brand cursor-pointer shadow-accent-lg"
                    }`}
            >

                {loading ? "Please wait…" : "Login →"}
            </button>
            {error && (
                <div className="text-red-500 text-[13px] mb-4 px-3.5 py-2.5 bg-red-500/10 rounded-lg border border-red-500/25">
                    {error}
                </div>
            )}
        </div>
    )
}