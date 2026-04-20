import axios from "axios";
import { resumeToPipeableStream } from "react-dom/server";
import toast from "react-hot-toast";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getHabbitsByUserId = async (userId) => {
    try {
        const result = await axios.get(`${baseUrl}/api/habbits?userId=${userId}`, {
            headers: {
                'Cache-Control': 'no-cache',
            }
        });
        return result.data;
    } catch (error) {
        throw error
    }
}


const saveHabbitForUserId = async (data) => {
    try {
        const result = await axios.post(`${baseUrl}/api/habbits`, data, {
            headers: {
                "Content-Type": 'application/json'
            }
        })
        if (result.status === 200) {
            toast.success("Habit updated!")
        } else if (result.status === 204) {
            toast.error('Habit could not be added.')
        }
    } catch (error) {
        console.log(error);
        toast.error('Failed to update habit.')
    }
}


const getHabbitLogsByUserId = async (id) => {
    const result = await axios.get(`${baseUrl}/api/habbits/log/${id}`, {
        headers: {
            'Cache-Control': 'no-cache',
        }
    });
    return result.data;
}


const toggleTasklog = (habit) => {

    axios.post(`${baseUrl}/api/habbits/log`, {
        hId: "22",
        uId: "18",
        logDate: "2026-04-19",
        status: !habit
    })
}

export {
    getHabbitsByUserId,
    saveHabbitForUserId,
    getHabbitLogsByUserId
}