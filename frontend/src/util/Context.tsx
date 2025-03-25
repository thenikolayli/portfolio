import {createSignal, createContext, createEffect} from "solid-js";
import axios from "axios";
const UserDataContext = createContext();

export default UserDataContext;

const UserDataProvider = (props: any) => {
    // dictionary that stores user data: username, groups, etc
    const [user_data, set_user_data] = createSignal<any>(null); // init value is null to indicate that the data is not loaded
    const [data_loaded, set_data_loaded] = createSignal(false);

    // updates data_loaded whenever user_data changes (loads)
    createEffect(() => {
        set_data_loaded(user_data() !== null)
    })

    // refreshed jwt, logs out on invalidation
    const refresh_token = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/account/refresh_token",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            set_user_data(response.data)
        } catch (error: any) {
            if (error.status === 404) { // invalid token
                await logout()
            } else { // not logged in
                set_user_data({})
            }
        }
    }

    // sends request to delete auth cookie, clears user data
    const logout = async () => {
        if (user_data()) {
            await axios({
                method: "delete",
                url: "/api/account/logout",
            })
            set_user_data({})
            location.assign("/login")
        }
    }

    // methods that are accessible through the context
    let context_data = {
        user_data: user_data,
        set_user_data: set_user_data,
        refresh_token: refresh_token,
        logout: logout,
        data_loaded: data_loaded
    }

    return (
        <UserDataContext.Provider value={context_data}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export { UserDataProvider };