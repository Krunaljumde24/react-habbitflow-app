import { useContext, useState } from "react";
import { hashPw, store } from "../utils/commonUtils";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/userAuth";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from '../context/AppContext'
import { useNavigate } from "react-router";
import { getHabbitsByUserId } from "../service/AppService";

export default function Login({ error, setError, loading, setLoading }) {

    // const [isLogin, setIsLogin] = useState(true);
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm()
    const inputCls = "w-full px-3.5 py-3 bg-[#0d1117] border border-[#30363d] rounded-[10px] text-[#e6edf3] text-sm font-sans outline-none box-border focus:border-violet-600 transition-colors";

    const { loginContext } = useContext(AuthContext);
    const { habbits, setHabbits, view, setView } = useContext(AppContext)

    const { login, validateLoginSession } = useAuth();
    const navigate = useNavigate()

    const submit = async (data) => {
        if (!data.email?.trim() || !data.password?.trim()) {
            console.log('invalid data');
        } else {
            setError("");
            setLoading(true);
            const status = await login(data);
            if (status.status === 'Success') {
                let userId = status.data.user.id;
                toast.success(status.message)
                loginContext(status.data);
                // const habitsData = await getHabbitsByUserId(userId)
                // setHabbits(habitsData)
                setView('dashboard')
                setLoading(false);
                navigate('/')
                return;
            } else {
                toast.error(status.message);
                setError(status.message);
                setLoading(false);
                return;
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="mb-4">
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Email</label>
                <input
                    className={inputCls}
                    {...register('email', {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email"
                        }
                    })}
                    placeholder="you@example.com"
                    type="email"
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className={error ? "mb-3.5" : "mb-6"}>
                <label className="block text-[#8b949e] text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
                <input
                    className={inputCls}
                    {...register('password', {
                        required: true
                    })}
                    placeholder="••••••••"
                    type="password"
                />
            </div>

            <button
                disabled={loading}
                className={`w-full py-3.5 border-none rounded-xl text-white font-extrabold text-[15px] font-sans transition-all duration-200 tracking-[0.01em] ${loading ? "bg-gray-600 cursor-not-allowed" : "gradient-brand cursor-pointer shadow-accent-lg"
                    }`}
            >

                {loading ? "Please wait…" : "Login →"}
            </button>
            {error && (
                <div className="text-red-500 text-[13px] my-2 px-3.5 py-2.5 bg-red-500/10 rounded-lg border border-red-500/25">
                    {error}
                </div>
            )}

            <button className="bg-amber-300 px-2 py-1 my-2 rounded-lg font-bold"
                onClick={() => {
                    setValue("email", "jamesbond@habbitflow.com");
                    setValue("password", "password");
                }}
                type="button"
            >
                Use James User
            </button>
        </form >
    )
}