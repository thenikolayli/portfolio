import {createSignal, createContext, onMount, createMemo} from "solid-js";
import axios from "axios";

const UserDataContext = createContext();

export default UserDataContext;

const UserDataProvider = (props: any) => {
    // dictionary that stores user data: username, groups, etc
    const [userData, setUserData] = createSignal("");

    // function to log out, removes user data and reloads the window
    const logout = async () => {
        await axios({
            method: 'GET',
            url: "/api/logout",
        })
        setUserData("")
        location.replace("/login")
    }

    // function to refresh jwt token pair, logs the user out on failure (no tokens/expired)
    const refreshToken = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/refreshtoken/",
            })

            setUserData(JSON.stringify(response.data))
        } catch (error: any) {
            if (error.status === 401) {
                logout()
            }
        }
    }
    //  function that returns parsed user data, if there is any
    const getUserData = createMemo(() => {
        if (userData() !== "") {
            return JSON.parse(userData())
        } else {
            return null
        }
    })


    let contextData = {
        userData: userData,
        setUserData: setUserData,
        logout: logout,
        refreshToken: refreshToken,
        getUserData: getUserData
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