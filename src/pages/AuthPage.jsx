import { useState } from "react";
import { hashPw, store } from "../utils/commonUtils";

function AuthPage({ onAuth }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const submit = () => {
        setError(""); setLoading(true);
        // Simulated async API call — replace with fetch("/api/auth/...") in production
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
                const nu = { id: uid(), name: form.name, email: form.email, passwordHash: hashPw(form.password), createdAt: new Date().toISOString() };
                store.set("users", [...users, nu]);
                const { passwordHash: _, ...safe } = nu;
                store.set("currentUser", safe);
                onAuth(safe);
            }
            setLoading(false);
        }, 450);
    };

    const inp = {
        style: { width: "100%", padding: "12px 14px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "10px", color: "#e6edf3", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
        onFocus: (e) => (e.target.style.borderColor = "#7c3aed"),
        onBlur: (e) => (e.target.style.borderColor = "#30363d"),
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#0d1117 0%,#161b22 60%,#0d1117 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: '"Plus Jakarta Sans",system-ui,sans-serif' }}>
            {/* Ambient glow */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-25%", right: "-15%", width: "600px", height: "600px", background: "radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)", borderRadius: "50%" }} />
            </div>

            <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
                {/* Brand */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "68px", height: "68px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "20px", marginBottom: "16px", boxShadow: "0 12px 40px rgba(124,58,237,.45)", fontSize: "30px" }}>🔥</div>
                    <h1 style={{ color: "#e6edf3", fontSize: "30px", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-0.8px" }}>HabitFlow</h1>
                    <p style={{ color: "#8b949e", fontSize: "15px", margin: 0 }}>Build habits that last a lifetime.</p>
                </div>

                <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
                    {/* Tab switcher */}
                    <div style={{ display: "flex", background: "#0d1117", borderRadius: "12px", padding: "4px", marginBottom: "28px" }}>
                        {["Login", "Sign Up"].map((tab, i) => (
                            <button key={tab} onClick={() => { setIsLogin(i === 0); setError(""); }}
                                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", fontFamily: "inherit", transition: "all 0.2s", background: (i === 0) === isLogin ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent", color: (i === 0) === isLogin ? "#fff" : "#8b949e" }}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
                            <input {...inp} value={form.name} onChange={handle("name")} placeholder="Jane Doe" type="text" />
                        </div>
                    )}

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                        <input {...inp} value={form.email} onChange={handle("email")} placeholder="you@example.com" type="email" />
                    </div>

                    <div style={{ marginBottom: error ? "14px" : "24px" }}>
                        <label style={{ display: "block", color: "#8b949e", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                        <input {...inp} value={form.password} onChange={handle("password")} placeholder="••••••••" type="password" onKeyDown={(e) => e.key === "Enter" && submit()} />
                    </div>

                    {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", padding: "10px 14px", background: "rgba(239,68,68,.1)", borderRadius: "8px", border: "1px solid rgba(239,68,68,.25)" }}>{error}</div>}

                    <button onClick={submit} disabled={loading}
                        style={{ width: "100%", padding: "14px", background: loading ? "#374151" : "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: "0 6px 20px rgba(124,58,237,.4)", letterSpacing: "0.01em" }}>
                        {loading ? "Please wait…" : isLogin ? "Sign In →" : "Create Account →"}
                    </button>

                    {/* Demo creds */}
                    <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(124,58,237,.1)", borderRadius: "10px", border: "1px solid rgba(124,58,237,.25)" }}>
                        <p style={{ color: "#8b5cf6", fontSize: "11px", fontWeight: "700", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>🔑 Demo Account</p>
                        <p style={{ color: "#c4b5fd", fontSize: "13px", margin: 0 }}>demo@habitflow.com · demo123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage