import {createSignal, createContext, onMount} from "solid-js";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const UserDataContext = createContext();

export default UserDataContext;

const UserDataProvider = (props: any) => {
    const [userData, setUserData] = createSignal();

    const login = async (username: string, password: string) => {
        try {
            const response = await axios({
                method: 'POST',
                url: "/api/token/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username: username,
                    password: password,
                }
            })
            if (response.status === 200) {
                localStorage.setItem("authTokens", JSON.stringify(response.data))
                setUserData(jwtDecode(response.data["access"]))
            }
            return response.status
        } catch (error: any) {
            return error.status
        }
    }

    const logout = () => {
        localStorage.removeItem("authTokens")
        setUserData(null)
        window.location.reload()
    }

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios({
                method: 'POST',
                url: "/api/register/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username: username,
                    email: email,
                    password: password,
                }
            })
            return response
        } catch (error: any) {
            return error
        }
    }

    const updateToken = async () => {
        try {
            const response = await axios({
                method: "POST",
                url: "/api/token/refresh/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    "refresh": JSON.parse(localStorage.getItem("authTokens")!)["refresh"]
                }
            })

            if (response.status === 200) {
                let data = response.data
                localStorage.setItem("authTokens", JSON.stringify(data))
                setUserData(jwtDecode(response.data["access"]))
            }
        } catch (error: any) {
            console.log(error)
            console.log("logging out")
            logout()
        }
    }

    const getCSRFToken = async () => {
        try {
            const response = await axios({
                "method": "GET",
                "url": "/api/csrf",
            })

            console.log(response.data)
            // if (response.status === 200) {
            //     let newUserData = JSON.parse(userData());
            //     newUserData["CSRFToken"] = response.data.CSRFToken;
            // }
        } catch (error: any) {
            console.log(error)
        }
    }

    let contextData = {
        userData: userData,
        login: login,
        logout: logout,
        register: register,
        updateToken: updateToken
    }

    onMount(() => {
        if (localStorage.getItem("authTokens")) {
            updateToken()
        }

        getCSRFToken()

        setInterval(() => {
            if (localStorage.getItem("authTokens")) {
                updateToken()
            }
        }, 4 * 60 * 1000)
    })

    return (
        <UserDataContext.Provider value={contextData}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export { UserDataProvider };