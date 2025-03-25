import {Match, onMount, Switch, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

const KeyClub = () => {
    onMount(() => document.title = "Key Club");
    const context: any = useContext(UserDataContext);
    const keyclub_role = "keyclubbot"

    return (
        <div class="flex flex-col min-h-screen w-full bg-bg_gray">
            <Navbar/>
            <div class="flex flex-col grow self-center items-center font-code mt-[10%] p-4 w-full sm:w-1/2">
                <h1 class="text-2xl">Key Club</h1>
                <h1 class="text-xl mt-4 text-left">Key Cub is a student-let volunteering organization.
                    I'm a member of the JHS Key Club in Division 21 (D21). Hours are logged manually in our Key Club,
                    and that takes a lot of time,
                    therefore I wrote a program that automates the logging process.
                    <br/>
                </h1>
                <Switch>
                    <Match when={context.data_loaded() && context.user_data()?.roles.includes(keyclub_role)}>
                        <div class="text-left mt-4">
                            <h1 class="text-2xl mt-4">Hello {context.user_data().username}!</h1>
                            <h1 class="text-xl">
                                <span class="underline">You have access</span> to the Key Club bot I wrote.
                                You may find it <a class="text-primary underline" href="/keyclub/log">here</a>, or under the <span
                                class="underline">More</span> section in the navbar
                                (you must be logged in to have the Key Club Logging option).
                            </h1>
                        </div>
                    </Match>
                    <Match when={context.data_loaded() && !context.user_data()?.roles.includes(keyclub_role)}>
                        <div class="text-left mt-4">
                            <h1 class="text-2xl font-ibm">Hello {context.user_data().username}</h1>
                            <h1 class="text-xl">
                                You <span class="underline">do not</span> have access to the Key Club bot.
                                Access is only given to those who log hours for the JHS Key Club (certain club
                                officers).
                            </h1>
                        </div>
                    </Match>
                    <Match when={!context.data_loaded() && !context.user_data()}>
                        <div class="text-left mt-4">
                            <h1 class="text-xl">
                                You are <span class="underline">unauthorized</span>, log in to check if you have access.
                                Access is only given to those who log hours for the JHS Key Club (certain club
                                officers).
                            </h1>
                        </div>
                    </Match>
                </Switch>
            </div>
            <Footer/>
        </div>
    )
}

export default KeyClub