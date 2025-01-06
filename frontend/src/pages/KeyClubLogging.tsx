import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import {createSignal, Match, onMount, Switch, useContext} from "solid-js";
import {BsGoogle} from "solid-icons/bs";
import UserDataContext from "../util/Context.tsx";
import axios from "axios";
import {FiArchive, FiClock, FiLink, FiX} from "solid-icons/fi";
import {clsx} from "clsx";

const KeyClubLogging = () => {
    onMount(() => document.title = "Key Club Logging")
    const context: any = useContext(UserDataContext);
    const groupName = import.meta.env.VITE_KEYCLUB_GROUP_NAME

    const [logType, setLogType] = createSignal("event")
    const [link, setLink] = createSignal("")
    const [hoursMultiplier, setHoursMultiplier] = createSignal("")
    const [meetingName, setMeetingName] = createSignal("")
    const [meetingLength, setMeetingLength] = createSignal("")
    const [firstNameCol, setFirstNameCol] = createSignal("")
    const [lastNameCol, setLastNameCol] = createSignal("")

    const googleLogIn = async () => {
        const response = await axios({
            method: "POST",
            url: "/api/googleauthorize/"
        })

        if (response.status === 200) {
            location.href = response.data
        }
    }

    // const logEvent = async () => {
    //
    // }

    return (
        <div class="flex flex-col min-h-[120vh] w-full bg-bg_gray">
            <Navbar/>
            <div class="flex flex-col flex-grow w-full sm:w-1/2 mt-[10%] self-center items-center font-code">
                <Switch>
                    <Match when={context.getUserData() && context.getUserData()["groups"].includes(groupName)}>
                        <div class="flex flex-col justify-center text-center">
                            <h1 class="text-3xl text-center mb-4">Key Club Logging</h1>
                            <h1 class="text-2xl text-left">
                                <span class="underline">You have access</span> to the Key Club bot.
                                Access is only given to those who log hours for the JHS Key Club (certain club
                                officers).
                            </h1>

                            <div class="mt-12 p-4 shadow-lg">
                                <div class="flex w-fit gap-x-1">
                                    <button onclick={() => setLogType("event")}
                                            class={clsx("rounded-t border-t-2 border-x-2 p-1 transition duration-300", {
                                                "hover:border-gray-400 border-gray-300": logType() !== "event",
                                                "border-gray-400": logType() === "event",
                                            })}>Log events
                                    </button>
                                    <button onclick={() => setLogType("meeting")}
                                            class={clsx("rounded-t border-t-2 border-x-2 p-1 transition duration-300", {
                                                "hover:border-gray-400 border-gray-300": logType() !== "meeting",
                                                "border-gray-400": logType() === "meeting",
                                            })}>Log meetings
                                    </button>
                                </div>
                                <div class="border-t-2 border-black flex flex-col justify-center items-center">
                                    <Switch>
                                        <Match when={logType() === "event"}>
                                            <span class="text-3xl mt-4">Log Event Directions</span>
                                            <ul class="list-inside mt-2 gap-y-1 list-disc text-xl text-left w-[80%]">
                                                <li>Click on the login button below (if this is your first time) and log
                                                    in
                                                    using a Google Account that can <span class="underline">view and edit</span> the
                                                    required files (hours spreadsheet, event signup docs, meeting
                                                    attendance speadsheets)
                                                </li>
                                                <li>Paste the link to the event sign up doc of the event you'd like to
                                                    log
                                                </li>
                                                <li>Enter the hours multiplier for that event (default is 1)</li>
                                            </ul>
                                            <button onclick={googleLogIn}
                                                    class="flex mt-4 text-xl w-fit p-1 border-primary border-2  items-center gap-2 hover:shadow-lg transition duration-300">
                                                <BsGoogle/>Log in with Google
                                            </button>
                                            <form
                                                class="w-[90%] mt-4 gap-y-2 flex flex-col justify-center items-center">
                                                <div
                                                    class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                    <label for="event_link"><FiLink/></label>
                                                    <input type="url" id="event_link" value={link()} oninput={(e) => setLink(e.target.value)}
                                                           class="bg-transparent outline-none w-full"
                                                           placeholder="Paste link here"/>
                                                </div>
                                                <div
                                                    class="flex w-full self-start items-center border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                    <label for="hours_multiplier" class="text-lg mr-1"><FiX/></label>
                                                    <input type="number" id="hours_multiplier" value={hoursMultiplier()}
                                                           class="bg-transparent w-full outline-none text-lg" oninput={(e) => setHoursMultiplier(e.target.value)}
                                                           placeholder="Hours multiplier (1 default)"/>
                                                </div>
                                                <button type="submit"
                                                        class="p-2 font-ibm text-xl hover:shadow-lg transition duration-300">Log
                                                    event
                                                </button>
                                            </form>
                                        </Match>
                                        <Match when={logType() === "meeting"}>
                                            <span class="text-3xl mt-4">Log Meeting Directions</span>
                                            <ul class="list-inside mt-2 gap-y-1 list-disc text-xl text-left w-[80%]">
                                                <li>Click on the login button below (if this is your first time) and log
                                                    in
                                                    using a Google Account that can <span class="underline">view and edit</span> the
                                                    required files (hours spreadsheet, event signup docs, meeting
                                                    attendance speadsheets)
                                                </li>
                                                <li>Paste the link to the event sign up doc of the event you'd like to
                                                    log
                                                </li>
                                                <li>Enter the hours multiplier for that event (default is 1)</li>
                                            </ul>
                                            <button onclick={googleLogIn}
                                                    class="flex mt-4 text-xl w-fit p-1 border-primary border-2  items-center gap-2 hover:shadow-lg transition duration-300">
                                                <BsGoogle/>Log in with Google
                                            </button>
                                            <form
                                                class="w-[90%] mt-4 gap-y-2 flex flex-col justify-center items-center">
                                                <div
                                                    class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                    <label for="meeting_link"><FiLink/></label>
                                                    <input type="url" id="meeting_link" oninput={(e) => setLink(e.target.value)}
                                                           class="bg-transparent outline-none w-full text-lg" value={link()}
                                                           placeholder="Paste link here"/>
                                                </div>
                                                <div
                                                    class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                    <label for="meeting_name"><FiArchive/></label>
                                                    <input type="text" id="meeting_name" oninput={(e) => setMeetingName(e.target.value)}
                                                           class="bg-transparent outline-none w-full text-lg" value={meetingName()}
                                                           placeholder="Meeting name"/>
                                                </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 self-start justify-between w-full">
                                                    <div
                                                        class="flex w-full border-b-2 gap-x-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                        <label for="first_name_col" class="text-lg">F</label>
                                                        <input type="text" id="first_name_col" oninput={(e) => setFirstNameCol(e.target.value)}
                                                               class="bg-transparent outline-none text-lg" value={firstNameCol()}
                                                               placeholder={"First name col"}/>
                                                    </div>
                                                    <div
                                                        class="flex w-full border-b-2 gap-x-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                        <label for="last_name_col" class="text-lg">L</label>
                                                        <input type="text" id="last_name_col" oninput={(e) => setLastNameCol(e.target.value)}
                                                               class="bg-transparent outline-none text-lg" value={lastNameCol()}
                                                               placeholder={"Last name col"}/>
                                                    </div>
                                                    <div
                                                        class="flex w-full border-b-2 gap-x-2 items-center border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                        <label for="meeting_length"><FiClock/></label>
                                                        <input type="number" id="meeting_length" oninput={(e) => setMeetingLength(e.target.value)}
                                                               class="bg-transparent outline-none text-lg w-full" value={meetingLength()}
                                                               placeholder={"Meeting length"}/>
                                                    </div>
                                                </div>
                                                <button type="submit"
                                                        class="p-2 font-ibm text-xl hover:shadow-lg transition duration-300">Log meeting
                                                </button>
                                            </form>
                                        </Match>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </Match>
                    <Match when={context.getUserData() && !context.getUserData()["groups"].includes(groupName)}>
                        <div class="flex flex-col justify-center">
                            <h1 class="text-3xl text-center mb-4">Key Club Logging</h1>
                            <h1 class="text-2xl text-left">
                                You <span class="underline">do not</span> have access to the Key Club bot.
                                Access is only given to those who log hours for the JHS Key Club (certain club
                                officers).
                            </h1>
                        </div>
                    </Match>
                    <Match when={!context.getUserData()}>
                        <div class="flex flex-col justify-center">
                            <h1 class="text-3xl text-center mb-4">Key Club Logging</h1>
                            <h1 class="text-2xl text-left">
                                You are <span class="underline">unauthorized</span>, log in to check if you have
                                access.
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

export default KeyClubLogging;