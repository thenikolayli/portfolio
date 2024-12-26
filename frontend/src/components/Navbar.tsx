import {createSignal, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import {Portal} from "solid-js/web";
import {clsx} from "clsx";
import {FiMenu, FiX} from "solid-icons/fi";

const Navbar = () => {
    const [showMenu, setShowMenu] = createSignal(false)
    const {logout, userData} = useContext(UserDataContext)

    const getUsername = () => {
        if (userData()) {
            return userData()["username"]
        } else {
            return null
        }
    }

    return (
        <Portal mount={document.getElementById("navbar")!} >
            <>
                <div class="container hidden sm:block">
                    <div class="absolute flex justify-self-center inset-x-0 w-fit h-fit p-4 space-x-8 font-code text-xl">
                        <a class="hover:shadow-lg transition duration-300" href="/">Home</a>
                        <a class="hover:shadow-lg transition duration-300" href="/keyclub">Key Club</a>
                        <div class="flex flex-col items-center" onmouseout={() => setShowMenu(false)} onmouseover={() => setShowMenu(true)} >
                            <h1 class="hover:shadow-lg w-fit transition duration-300">More</h1>
                            <div class={clsx("absolute top-0 container w-fit space-y-3 p-4 backdrop-blur transition duration-300", {
                                "-translate-y-full": !showMenu(),
                                "shadow-xl": showMenu()
                            })}>
                                <a href="/accesskeys" class="text-lg font-code text-nowrap">Access Keys</a>
                            </div>
                        </div>
                    </div>
                    <div class="absolute flex right-4 w-fit h-fit p-4 font-ibm text-xl">
                        <div class={clsx("container space-x-4", {"hidden": getUsername()})}>
                            <a class="p-1 hover:shadow-lg transition duration-300" href="/register">register</a>
                            <a class="p-1 hover:shadow-lg transition duration-300" href="/login">login</a>
                        </div>
                        <div class={clsx("container space-x-4", {"hidden": !getUsername()})}>
                            <a class="p-1 hover:shadow-lg transition duration-300" href="/settings">{getUsername()}</a>
                            <a class="p-1 hover:shadow-lg transition duration-300" href="#" onClick={logout}>logout</a>
                        </div>
                    </div>
                </div>
                <div class="container block sm:hidden">
                    <div class="absolute flex right-0 w-fit h-fit p-4 space-x-4 font-ibm text-xl">
                        <a class="p-1 hover:shadow-lg transition duration-300"
                           href="/settings">{getUsername()}</a>
                        <button onClick={() => setShowMenu(!showMenu())}><FiMenu class="size-8"/></button>
                    </div>
                    <div class={clsx("absolute p-4 w-screen h-screen backdrop-blur transition duration-200", {
                        "opacity-100 pointer-events-auto": showMenu(),
                        "opacity-0 pointer-events-none": !showMenu()
                    })}>
                        <button class="absolute right-0 px-4" onClick={() => setShowMenu(!showMenu())}><FiX class="size-8"/></button>
                        <div class="absolute flex top-1/4 justify-self-center inset-x-0 flex-col space-y-4">
                            <a class="font-code text-2xl w-fit hover:shadow-lg transition duration-300"
                               href="/">Home</a>
                            <a class="font-code text-2xl w-fit hover:shadow-lg transition duration-300"
                               href="keyclub/">Key Club</a>
                            <a class="font-code text-2xl w-fit hover:shadow-lg transition duration-300"
                               href="more/">More</a>
                            <a class={clsx("font-ibm text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": getUsername()})}
                               href="register/">register</a>
                            <a class={clsx("font-ibm text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": getUsername()})}
                               href="login/">login</a>
                            <a class={clsx("font-ibm text-2xl w-fit hover:shadow-lg transition duration-300", {"hidden": !getUsername()})}
                               href="#" onClick={logout}>logout</a>
                        </div>
                    </div>
                </div>
            </>
        </Portal>
    )
}

export default Navbar