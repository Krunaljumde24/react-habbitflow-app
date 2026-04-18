import { useState } from "react";
import { signUp } from "../service/AuthService";
import { store } from "../utils/commonUtils";
import toast from "react-hot-toast";

export default function SignUp({ onAuth, error, setError, loading, setLoading }) {

    const inputCls = "w-full px-3.5 py-3 bg-[#0d1117] border border-[#30363d] rounded-[10px] text-[#e6edf3] text-sm font-sans outline-none box-border focus:border-violet-600 transition-colors";

    const [form, setForm] = useState(
        {
            name: "",
            email: "",
            password: ""
        });

    const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const submitSignup = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {

            if (!form.email?.trim() || !form.name?.trim() || !form.password?.trim()) {
                setError("Invalid name, email or password.");
            } else {

                signUp(form)

            }

            setLoading(false);

            // signUp(form);

            // const users = store.get("users") || [];
            // if (isLogin) {
            //     const u = users.find((u) => u.email === form.email && u.passwordHash === hashPw(form.password));
            //     if (!u) { setError("Invalid email or password."); setLoading(false); return; }
            //     const { passwordHash: _, ...safe } = u;
            //     store.set("currentUser", safe);
            //     onAuth(safe);
            // } else {
            //     if (users.find((u) => u.email === form.email)) { setError("Email already in use."); setLoading(false); return; }
            //     const nu = { id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2), name: form.name, email: form.email, passwordHash: hashPw(form.password), createdAt: new Date().toISOString() };
            //     store.set("users", [...users, nu]);
            //     const { passwordHash: _, ...safe } = nu;
            //     store.set("currentUser", safe);
            //     onAuth(safe);
            // }
        }, 450);
    };

    return (
        <form>
            <div className="mb-4">
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                    className={inputCls}
                    value={form.name}
                    onChange={handle("name")}
                    placeholder="James Bond"
                    type="text" />
            </div>
            <div className="mb-4">
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Email</label>
                <input
                    className={inputCls}
                    value={form.email}
                    onChange={handle("email")}
                    placeholder="you@example.com"
                    type="email"
                />
            </div>
            <div className={error ? "mb-3.5" : "mb-6"}>
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
                <input
                    className={inputCls}
                    value={form.password}
                    onChange={handle("password")}
                    placeholder="••••••••"
                    type="password"
                // onKeyDown={(e) => e.key === "Enter" && submit()}
                />
            </div>

            <button
                onClick={(e) => submitSignup(e)}
                disabled={loading}
                type="submit"
                className={`w-full py-3.5 border-none rounded-xl text-white font-extrabold text-[15px] font-sans transition-all duration-200 tracking-[0.01em] ${loading ? "bg-gray-600 cursor-not-allowed" : "gradient-brand cursor-pointer shadow-accent-lg"
                    }`}
            >

                {loading ? "Please wait…" : "Sign Up →"}
            </button>


            {error && (
                <div className="text-red-500 text-[13px] my-4 px-3.5 py-2.5 bg-red-500/10 rounded-lg border border-red-500/25">
                    {error}
                </div>
            )}
        </form>
    )
}