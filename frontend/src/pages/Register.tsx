import {createEffect, createSignal, Match, onMount, Switch, useContext} from "solid-js";
import {FiEye, FiEyeOff, FiLock, FiMail, FiUser} from "solid-icons/fi";
import {clsx} from "clsx";
import axios from "axios";
import UserDataContext from "../util/Context.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

const Register = () => {
    const [button_enabled, set_button_enabled] = createSignal(true)
    const [api_response, set_api_response] = createSignal("")

    const [username, set_username] = createSignal("")
    const [email, set_email] = createSignal("")
    const [password, set_password] = createSignal("")
    const [password_visible, set_password_visible] = createSignal(false)
    const context: any = useContext(UserDataContext)

    onMount(async () => document.title = "Register")

    createEffect(() => {
        if (context.user_data()?.username) {
            location.assign("/")
        }
    })

    const register = async (event: any) => {
        event.preventDefault()
        if (!button_enabled()) return
        set_button_enabled(false)

        try {
            const response = await axios({
                method: "post",
                url: "/api/account",
                data: {
                    username: username(),
                    email: email(),
                    password: password()
                },
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 201) {
                set_api_response("Account created")
            }
        } catch (error: any) {
            if (error.status === 422) {
                set_api_response("Empty fields")
            } else {
                set_api_response(error.response.data.detail)
            }
        }
        set_button_enabled(true)
    }

    return (
        <div class="flex flex-col min-h-screen w-full bg-bg_gray">
            <Navbar/>
            <div
                class="flex flex-col grow self-center items-center font-code mt-[10%] p-4 w-full sm:w-1/3">
                <h1 class="text-3xl">Register</h1>
                <form onSubmit={register} class="container w-full mt-4 space-y-2">
                    <div
                        class="flex w-full text-xl items-center border-b-2 border-black focus-within:border-black/30 hover:border-black/30 transition duration-200">
                        <label for="username_field"><FiUser/></label>
                        <input type="text" id={"username_field"} class={"outline-none ml-1"} placeholder={"username"}
                               oninput={(event: any) => set_username(event.target.value)}
                               value={username()}/>
                    </div>
                    <div
                        class="flex w-full my-4 text-xl items-center border-b-2 border-black focus-within:border-black/30 hover:border-black/30 transition duration-200">
                        <label for="email_field"><FiMail/></label>
                        <input type="email" id={"email_field"} class={"outline-none ml-1"} placeholder={"email"}
                               oninput={(event: any) => set_email(event.target.value)}
                               value={email()}/>
                    </div>
                    <div
                        class="flex w-full text-xl items-center border-b-2 border-black focus-within:border-black/30 hover:border-black/30 transition duration-200">
                        <label for="password_field"><FiLock/></label>
                        <input type={clsx({"password": !password_visible(), "text": password_visible()})} id={"password_field"} class={"outline-none ml-1"} placeholder={"password"}
                               oninput={(event: any) => set_password(event.target.value)}
                               value={password()}/>
                        <button type={"button"} class={"relative left-4"} onclick={() => set_password_visible(!password_visible())}>
                            <Switch>
                                <Match when={!password_visible()}>
                                    <FiEye/>
                                </Match>
                                <Match when={password_visible()}>
                                    <FiEyeOff/>
                                </Match>
                            </Switch>
                        </button>
                    </div>
                    <button type="submit"
                            class={clsx("flex justify-self-center text-2xl font-ibm p-1 transition duration-300", {
                                "text-black/50 pointer-events-none": !button_enabled(),
                                "hover:shadow-lg": button_enabled(),
                            })}>Enter
                    </button>
                    <h1 class="text-lg">{api_response()}</h1>
                </form>
                <h1 class="font-code text-lg mt-4">
                    By registering, you can get access to additional features unlocked by
                    using <a href="/accesskeys" class="text-primary">access keys</a>.
                </h1>
            </div>
            <Footer/>
        </div>
    )
}

export default Register