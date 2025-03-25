import {createSignal, onMount} from "solid-js";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import {FiKey} from "solid-icons/fi";
import {clsx} from "clsx";
import axios from "axios";

const AccessKeys = () => {
    const [access_key, set_access_key] = createSignal("");
    const [api_response, set_api_response] = createSignal("");
    const [button_enabled, set_button_enabled] = createSignal(true);

    onMount(() => document.title = "Access Keys")

    const activate_access_key = async (event: any) => {
        event.preventDefault();
        if (!button_enabled()) return;
        set_button_enabled(false);

        try {
            const response = await axios({
                method: "post",
                url: "/api/account/access_key",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    "key": access_key(),
                }
            })

            if (response.status === 200) {
                set_api_response(response.data)
            }
        } catch (error: any) {
            if (error.status === 422) {
                set_api_response("Empty field")
            } else {
                set_api_response(error.response.data)
            }
        }

        set_button_enabled(true)
    }

    return (
        <div class="flex flex-col min-h-screen w-full bg-bg_gray">
            <Navbar/>
            <div class="flex flex-col grow self-center items-center font-code mt-[10%] p-4 w-full sm:w-1/3">
                <h1 class="text-3xl text-center">Access Keys</h1>
                <form class="mt-8 w-full flex flex-col items-center" onsubmit={activate_access_key}>
                    <div
                        class={"flex border-b-2 border-gray-300 w-full items-center justify-center transition duration-300"}>
                        <label for="access_key"><FiKey/></label>
                        <input value={access_key()} oninput={(event) => set_access_key(event.target.value)}
                               class={"w-full ml-1 text-lg bg-transparent outline-hidden"}
                               placeholder={"Access Key here"} type="text" id="access_key"/>
                    </div>
                    <h1 class="text-md mt-2">{api_response()}</h1>
                    <button type="submit" class={clsx("font-ibm text-xl w-fit p-2 transition duration-300", {
                        "text-black/50 pointer-events-none": !button_enabled(),
                        "hover:shadow-lg": button_enabled(),
                    })}>
                        Activate
                    </button>
                </form>
                <h1 class="text-xl font-semibold mt-10">
                    What are Access Key?
                </h1>
                <h1 class="text-lg mt-1">
                    An Access Key is a key that can be activated to change which roles you account has.
                    <br/>
                    For example, you could use an Access Key to gain access to the <a class="text-primary underline"
                                                                                      href={"/keyclub"}>Key
                    Club</a> logging bot.
                    <br/>
                    Access Keys are single use, and can only be created and given out by an administrator.
                    You must be logged into your account in order to use an Access Key.
                </h1>
            </div>
            <Footer/>
        </div>
    )
}

export default AccessKeys;