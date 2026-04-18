import axios from "axios"
import { Bold } from "lucide-react";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (data) => {
    try {
        const result = await axios.post(`${baseUrl}/api/auth/login`, data, {
            headers: {
                "Content-Type": 'application/json'
            }
        });
        console.log(result);

        return result;
    } catch (error) {
        console.log(error);
        return false;

    }

}

export const signUp = (data) => {
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
                    // style: {
                    //     borderRadius: '10px',
                    //     background: '#F3BE7A',
                    //     color: 'black',
                    //     fontSize: '14px'
                    // }
                })
                break;

            default:
                break;
        }

    }).catch(error => {
        console.log(error);

    })

}