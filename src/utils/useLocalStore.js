

const useLocalStore = () => {
    const getUserDetails = () => {
        const data = JSON.parse(localStorage.getItem('userData'))
        return data.user;
    }

    const getUserId = () => {
        const data = JSON.parse(localStorage.getItem('userData'))
        return data.user.id;
    }
    return {
        getUserDetails,
        getUserId
    }
}

export default useLocalStore;