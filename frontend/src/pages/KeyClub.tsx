import {createMemo, Match, onMount, Switch, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

const KeyClub = () => {
    onMount(() => document.title = "Key Club");
    const context: any = useContext(UserDataContext);
    const getUserData = createMemo(() => {
        if (context.userData() !== "") {
            return JSON.parse(context.userData())
        } else {
            return null
        }
    })
    const groupName = import.meta.env.VITE_KEYCLUB_GROUP_NAME

    // const handleClick = async () => {
    //
    // }

    return (
        <>
            <Navbar />
            <div class="min-h-screen w-full bg-bg_gray font-code flex justify-center">
                <div class="absolute container p-4 w-full md:w-1/2 flex flex-col justify-center text-center top-[10%]">
                    <h1 class="text-2xl">Key Club</h1>
                    <h1 class="text-xl mt-4 text-left">Key Cub is a student-let volunteering organization.
                        I'm a member of the JHS Key Club, D21. Hours are logged manually in our Key Club, and that takes a lot of time,
                        therefore I wrote a program that automates the logging process.
                        <br/>
                    </h1>
                    <Switch>
                        <Match when={getUserData() && getUserData()["groups"].includes(groupName)}>
                            <div class="text-left mt-4">
                                <h1 class="text-2xl font-ibm">Hello {getUserData()["username"]}</h1>
                                <h1 class="text-xl">You have access to the Key Club bot I wrote.</h1>
                                <button></button>
                            </div>
                        </Match>
                        <Match when={getUserData() && !getUserData()["groups"].includes(groupName)}>
                            <div class="text-left mt-4">
                                <h1 class="text-2xl font-ibm">Hello {getUserData()["username"]}</h1>
                                <h1 class="text-xl">
                                    You <span class="underline">do not</span> have access to the Key Club bot.
                                    Access is only given to those who log hours for the JHS Key Club (certain club officers).
                                </h1>
                            </div>
                        </Match>
                        <Match when={!getUserData()}>
                            <div class="text-left mt-4">
                                <h1 class="text-xl">
                                    You <span class="underline">do not</span> have access to the Key Club bot.
                                    Access is only given to those who log hours for the JHS Key Club (certain club officers).
                                </h1>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default KeyClub