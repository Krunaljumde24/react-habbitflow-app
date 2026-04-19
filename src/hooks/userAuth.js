import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const baseUrl = import.meta.env.VITE_API_BASE_URL;



const useAuth = () => {

    const { getUserDetails } = useContext(AuthContext)

    const login = async (data) => {
        try {
            const result = await axios.post(`${baseUrl}/api/auth/login`, data, {
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            return {
                status: error.response?.data?.status || "Failure",
                message:
                    error.response?.data?.message || error.message || "Something went wrong",
            };
        }
    }

    const signUp = (data) => {
        axios.post(`${baseUrl}/api/auth/register`, data, {
            headers: {
                "Content-Type": 'application/json'
            }
        }).then(resp => {
            console.log(resp.data.message);
            switch (resp.status) {
                case 201:
                    toast.success(resp.data.message)
                    break;

                case 200:
                    toast(resp.data.message, {
                        icon: '❗',
                    })
                    break;
                default:
                    break;
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const isLoginSessionValid = () => {
        const u = getUserDetails()
        if (u) {
            return true;
        } else {
            return false;
        }
    }

    return {
        login,
        signUp,
        isLoginSessionValid
    }
}

export default useAuth;