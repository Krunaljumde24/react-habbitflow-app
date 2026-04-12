import { useState } from "react";
import { hashPw, store } from "../utils/commonUtils";

export default function Login({ onAuth, form, setForm, handle, error, setError, loading, setLoading }) {

    const [isLogin, setIsLogin] = useState(true);

    const inputCls = "w-full px-3.5 py-3 bg-[#0d1117] border border-[#30363d] rounded-[10px] text-[#e6edf3] text-sm font-sans outline-none box-border focus:border-violet-600 transition-colors";


    const submit = () => {
        setError(""); setLoading(true);
        setTimeout(() => {
            const users = store.get("users") || [];
            if (isLogin) {
                const u = users.find((u) => u.email === form.email && u.passwordHash === hashPw(form.password));
                if (!u) { setError("Invalid email or password."); setLoading(false); return; }
                const { passwordHash: _, ...safe } = u;
                store.set("currentUser", safe);
                onAuth(safe);
            } else {
                if (!form.name || !form.email || !form.password) { setError("All fields are required."); setLoading(false); return; }
                if (users.find((u) => u.email === form.email)) { setError("Email already in use."); setLoading(false); return; }
                const nu = { id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2), name: form.name, email: form.email, passwordHash: hashPw(form.password), createdAt: new Date().toISOString() };
                store.set("users", [...users, nu]);
                const { passwordHash: _, ...safe } = nu;
                store.set("currentUser", safe);
                onAuth(safe);
            }
            setLoading(false);
        }, 450);
    };
    return (
        <div>
            <div className="mb-4">
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Email</label>
                <input className={inputCls} value={form.email} onChange={handle("email")} placeholder="you@example.com" type="email" />
            </div>

            <div className={error ? "mb-3.5" : "mb-6"}>
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
                <input
                    className={inputCls}
                    value={form.password}
                    onChange={handle("password")}
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