import {createSignal, createContext, onMount} from "solid-js";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const UserDataContext = createContext();

export default UserDataContext;

const UserDataProvider = (props: any) => {
    // dictionary that stores user data: username, groups, etc
    const [userData, setUserData] = createSignal(null);

    // function that attempts to log in, returns the response for wrapper function on Login.tsx
    const login = async (username: string, password: string) => {
        try {
            const response = await axios({
                method: 'POST',
                url: "/api/login/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username: username,
                    password: password,
                }
            })

            if (response.status === 200) {
                setUserData(response.data)
            }

            return response
        } catch (error: any) {
            return error
        }
    }

    // function to log out, removes user data and reloads the window
    const logout = async () => {
        await axios({
            method: 'GET',
            url: "/api/logout",
        })
        setUserData(null)
        location.replace("/login")
    }

    // function that registers the user, returns the response (with serializers errs) for wrapper function in Register.tsx
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

    // function to refresh jwt token pair, logs the user out on failure (no tokens/expired)
    const refreshToken = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/refreshtoken/",
            })

            setUserData(response.data)
        } catch (error: any) {
            if (error.status === 401) {
                logout()
            }
        }
    }


    let contextData = {
        userData: userData,
        login: login,
        logout: logout,
        register: register,
        refreshToken: refreshToken
    }

    onMount(() => {
        refreshToken()

        setInterval(() => {
            refreshToken()
        }, 4 * 60 * 1000)
    })

    return (
        <UserDataContext.Provider value={contextData}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export { UserDataProvider };