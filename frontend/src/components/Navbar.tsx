import {createSignal, Show, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import {clsx} from "clsx";
import {FiMenu, FiX} from "solid-icons/fi";

const Navbar = () => {
    const [show_menu, set_show_menu] = createSignal(false)
    const context: any = useContext(UserDataContext)
    const keyclub_role = "keyclubbot"

    return (
        <>
            <div class="w-full p-4 justify-center hidden sm:flex">
                <div class="flex self-center w-fit h-fit gap-x-8 font-code text-xl">
                    <a class="hover:shadow-lg p-1 transition duration-300" href="/">Home</a>
                    <a class="hover:shadow-lg p-1 transition duration-300" href="/keyclub">Key Club</a>
                    <div class="flex z-10 flex-col p-1 items-center hover:shadow-lg transition duration-300"
                         onmouseover={() => set_show_menu(true)}
                         onmouseout={() => set_show_menu(false)}>
                        <h1 class="z-10 w-fit">More</h1>
                        <div
                            class={clsx("absolute z-0 top-0 container w-fit pt-12 gap-y-3 p-4 flex flex-col backdrop-blur-sm transition duration-300", {
                                "-translate-y-full": !show_menu(),
                                "shadow-xl": show_menu()
                            })}>
                            <a href="/accesskeys"
                               class="text-lg font-code p-1 text-nowrap hover:shadow-lg transition duration-300">Access
                                Keys</a>
                            <Show when={context.data_loaded() && context.user_data().roles?.includes(keyclub_role)}>
                                <a href="/keyclub/log"
                                   class="text-lg font-code p-1 text-nowrap hover:shadow-lg transition duration-300">
                                    Key Club <br/> Logging
                                </a>
                            </Show>
                        </div>
                    </div>
                </div>
                <div class="absolute right-4 flex w-fit h-fit font-ibm text-xl">
                    <div class={clsx("container space-x-4", {"hidden": context.user_data()?.username})}>
                        <a class="p-1 hover:shadow-lg transition duration-300" href="/register">register</a>
                        <a class="p-1 hover:shadow-lg transition duration-300" href="/login">login</a>
                    </div>
                    <div class={clsx("container space-x-4", {"hidden": !context.user_data()?.username})}>
                        <a class="p-1 hover:shadow-lg transition duration-300" href="/settings">{context.user_data()?.username}</a>
                        <a class="p-1 hover:shadow-lg transition duration-300" href="#"
                           onClick={context.logout}>logout</a>
                    </div>
                </div>
            </div>
            <div class="block sm:hidden z-10">
                <div class="absolute flex top-4 right-4 gap-x-4 w-fit h-fit font-ibm text-xl">
                    <a class="p-1 hover:shadow-lg transition duration-300"
                       href="/settings">{context.user_data()?.username}</a>
                    <button type={"button"} onClick={() => set_show_menu(!show_menu())}><FiMenu class="size-8"/></button>
                </div>
                <div class={clsx("absolute top-0 w-screen h-screen backdrop-blur-sm transition duration-200", {
                    "opacity-100 pointer-events-auto": show_menu(),
                    "opacity-0 pointer-events-none": !show_menu()
                })}>
                    <button type={"button"} class="absolute top-4 right-4" onClick={() => set_show_menu(!show_menu())}><FiX class="size-8"/></button>
                    <div class="absolute flex top-1/4 justify-self-center inset-x-0 flex-col gap-y-4">
                        <a class="font-code p-1 text-2xl w-fit hover:shadow-lg transition duration-300"
                           href="/">Home</a>
                        <a class="font-code p-1 text-2xl w-fit hover:shadow-lg transition duration-300"
                           href="/keyclub">Key Club</a>
                        <a class="font-code p-1 text-2xl w-fit hover:shadow-lg transition duration-300"
                           href="/accesskeys">Access Keys</a>
                        <Show when={context.data_loaded() && context.user_data().roles?.includes(keyclub_role)}>
                            <a class="font-code p-1 text-2xl w-fit hover:shadow-lg transition duration-300"
                               href="/keyclub/log">Key Club Logging</a>
                        </Show>
                        <a class={clsx("font-ibm p-1 text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": context.user_data()?.username})}
                           href="/register">register</a>
                        <a class={clsx("font-ibm p-1 text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": context.user_data()?.username})}
                           href="/login">login</a>
                        <a class={clsx("font-ibm p-1 text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": !context.user_data()?.username})}
                           href="#" onClick={context.logout}>logout</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar