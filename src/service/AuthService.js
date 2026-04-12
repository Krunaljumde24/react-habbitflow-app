import axios from "axios"

const baseUrl = import.meta.env.VITE_API_BASE_URL
export const signUp = (data) => {
    console.log(data);

    axios.post(`${baseUrl}/api/auth/register`, data, {
        headers: {
            "Content-Type": 'application/json'
        }
    }).then(resp => {
        console.log(resp);

    }).catch(error => {
        console.log(error);

    })

}