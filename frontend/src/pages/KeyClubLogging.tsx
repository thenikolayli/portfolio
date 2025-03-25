import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import {createEffect, createSignal, Match, onMount, Show, Switch, useContext} from "solid-js";
import {BsGoogle} from "solid-icons/bs";
import UserDataContext from "../util/Context.tsx";
import axios from "axios";
import {FiArchive, FiClock, FiLink, FiX} from "solid-icons/fi";
import {clsx} from "clsx";

interface api_response_interface {
    message: string;
    logged?: {[key: string]: any};
    not_logged?: {[key: string]: any};
}

const KeyClubLogging = () => {
    onMount(() => document.title = "Key Club Logging")

    createEffect(() => {
        if (context.data_loaded() && !context.user_data().roles?.includes("keyclubbot")) {
            location.assign("/keyclub")
        } else if (context.data_loaded() && !context.user_data()) {
            location.assign("/keyclub")
        }
    })

    const context: any = useContext(UserDataContext);

    const [log_type, set_log_type] = createSignal("event")
    const [firstLast, setFirstLast] = createSignal(true)
    const [button_enabled, set_button_enabled] = createSignal(true)
    const [api_response, set_api_response] = createSignal<api_response_interface>({message: ""})

    const [link, set_link] = createSignal("")
    const [hours_multiplier, set_hours_multiplier] = createSignal("")
    const [meeting_title, set_meeting_title] = createSignal("")
    const [meeting_length, set_meeting_length] = createSignal("")
    const [first_name_col, set_first_name_col] = createSignal("")
    const [last_name_col, set_last_name_col] = createSignal("")

    // function that sends a request to log in the user via google (to authorize the bot)
    const google_log_in = async () => {
        const response = await axios({
            method: "post",
            url: "/api/keyclub/google_authorize"
        })

        if (response.status === 200) {
            location.href = response.data
        }
    }

    // function that submits the form and sends a request to log the event
    const log_event = async (event: any) => {
        event.preventDefault()
        if (!button_enabled()) return
        set_button_enabled(false)

        try {
            const response = await axios({
                method: "POST",
                url: "/api/keyclub/log_event",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    link: link(),
                    hours_multiplier: hours_multiplier(),
                }
            })

            if (response.status === 200) {
                set_api_response({
                    message: response.data.data,
                    logged: response.data.logged,
                    not_logged: response.data.not_logged,
                })
            }
        } catch (error: any) {
            if (error.status === 422) {
                set_api_response({
                    message: "Empty fields"
                })
            } else {
                set_api_response({
                    message: error.response.data
                })
            }
        }

        set_button_enabled(true)
    }

    // function that submits the form and sends a request to log the meeting
    const log_meeting = async (event: any) => {
        event.preventDefault()
        if (!button_enabled()) return
        set_button_enabled(false)

        try {
            const response = await axios({
                method: "post",
                url: "/api/keyclub/log_meeting",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    link: link(),
                    first_name_col: first_name_col(),
                    last_name_col: last_name_col(),
                    meeting_length: meeting_length(),
                    title: meeting_title(),
                }
            })

            if (response.status === 200) {
                set_api_response({
                    message: response.data.data,
                    logged: response.data.logged,
                    not_logged: response.data.not_logged,
                })
            }
        } catch (error: any) {
            if (error.status === 422) {
                set_api_response({
                    message: "Empty fields"
                })
            } else {
                set_api_response({
                    message: error.response.data
                })
            }
        }

        set_button_enabled(true)
    }

    return (
        <div class="flex flex-col min-h-[120vh] w-full bg-bg_gray">
            <Navbar/>
            <Show when={context.data_loaded() && context.user_data().roles?.includes("keyclubbot")}>
                <div class="flex p-4 flex-col grow w-full xl:w-[70%] 2xl:w-3/5 mt-[10%] self-center items-center font-code">
                    <div class="flex flex-col justify-center text-center">
                        <h1 class="text-3xl text-center mb-4">Key Club Logging</h1>
                        <h1 class="text-2xl text-left">
                            <span class="underline">You have access</span> to the Key Club bot.
                            Access is only given to those who log hours for the JHS Key Club (certain club
                            officers).
                        </h1>

                        <div class="mt-12 p-4 shadow-lg">
                            <div class="flex w-fit gap-x-1">
                                <button onclick={() => set_log_type("event")}
                                        class={clsx("rounded-t border-t-2 border-x-2 p-1 transition duration-300", {
                                            "hover:border-gray-400 border-gray-300": log_type() !== "event",
                                            "border-gray-400": log_type() === "event",
                                        })}>Log events
                                </button>
                                <button onclick={() => set_log_type("meeting")}
                                        class={clsx("rounded-t border-t-2 border-x-2 p-1 transition duration-300", {
                                            "hover:border-gray-400 border-gray-300": log_type() !== "meeting",
                                            "border-gray-400": log_type() === "meeting",
                                        })}>Log meetings
                                </button>
                            </div>
                            <div class="border-t-2 border-black flex flex-col justify-center items-center">
                                <Switch>
                                    <Match when={log_type() === "event"}>
                                        <span class="text-3xl mt-4">Log Event Directions</span>
                                        <ul class="list-inside mt-2 gap-y-1 list-disc text-xl text-left w-[80%]">
                                            <li>Click on the login button below (if this is your first time) and log
                                                in
                                                using a Google Account that can <span
                                                    class="underline">view and edit</span> the
                                                required files (hours spreadsheet, event signup docs, meeting
                                                attendance speadsheets)
                                            </li>
                                            <li>Paste the link to the event sign up doc of the event you'd like to
                                                log
                                            </li>
                                            <li>Enter the hours multiplier for that event (default is 1)</li>
                                        </ul>
                                        <button onclick={google_log_in}
                                                class="flex mt-4 text-xl w-fit p-1 border-primary border-2  items-center gap-2 hover:shadow-lg transition duration-300">
                                            <BsGoogle/>Log in with Google
                                        </button>
                                        <form onsubmit={(event) => log_event(event)}
                                              class="w-[90%] mt-4 gap-y-2 flex flex-col justify-center items-center">
                                            <div
                                                class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                <label for="event_link"><FiLink/></label>
                                                <input type="text" id="event_link" value={link()}
                                                       oninput={(e) => set_link(e.target.value)}
                                                       class="bg-transparent outline-hidden w-full text-lg"
                                                       placeholder="Paste link here"/>
                                            </div>
                                            <div
                                                class="flex w-full self-start items-center border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                <label for="hours_multiplier" class="text-lg mr-1"><FiX/></label>
                                                <input type="number" id="hours_multiplier" value={hours_multiplier()}
                                                       class="bg-transparent w-full outline-hidden text-lg"
                                                       oninput={(e) => set_hours_multiplier(e.target.value)}
                                                       placeholder="Hours multiplier (1 default)"/>
                                            </div>
                                            <button type="submit"
                                                    class={clsx("p-2 font-ibm text-xl transition duration-300", {
                                                        "pointer-events-none text-black/50": !button_enabled(),
                                                        "hover:shadow-lg": button_enabled()
                                                    })}>Log event
                                            </button>
                                        </form>
                                        <div class="w-[90%] mt-4 text-left">
                                            <h1 class="text-md">{api_response().message}</h1>
                                            <Show when={api_response().logged}>
                                                <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <h1 class="text-md">Volunteers logged</h1>
                                                        <table class="table-auto">
                                                            {Object.entries(api_response().logged || {}).map(([person, hours], index) => (
                                                                <tr>
                                                                    <td>{index + 1}.</td>
                                                                    <td>{person}</td>
                                                                    <td>{hours} hours</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <h1 class="text-md">Volunteers not logged</h1>
                                                        <table class="table-auto">
                                                            {Object.entries(api_response().not_logged || {}).map(([person, hours], index) => (
                                                                <tr>
                                                                    <td>{index + 1}.</td>
                                                                    <td>{person}</td>
                                                                    <td>{hours} hours</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </div>
                                                </div>
                                            </Show>
                                        </div>
                                    </Match>
                                    <Match when={log_type() === "meeting"}>
                                        <span class="text-3xl mt-4">Log Meeting Directions</span>
                                        <ul class="list-inside mt-2 gap-y-1 list-disc text-xl text-left w-[80%]">
                                            <li>Click on the login button below (if this is your first time) and log
                                                in
                                                using a Google Account that can <span
                                                    class="underline">view and edit</span> the
                                                required files (hours spreadsheet, event signup docs, meeting
                                                attendance speadsheets)
                                            </li>
                                            <li>Paste the link to the spreadsheet containing the responses of the
                                                attendance form
                                            </li>
                                            <li>Enter the meeting name</li>
                                            <li>If your spreadsheet saves first names and last names in separate
                                                columns, make sure
                                                the first/last option is selected, and input those columns into the
                                                corresponding fields.
                                                Otherwise, select the full name option and enter the column that
                                                contains the full names.
                                                Example: B (all the full names are in column B)
                                            </li>
                                            <li>Enter the meeting length <span class="underline">in minutes</span>
                                            </li>
                                        </ul>
                                        <button onclick={google_log_in}
                                                class="flex mt-4 text-xl w-fit p-1 border-primary border-2  items-center gap-2 hover:shadow-lg transition duration-300">
                                            <BsGoogle/>Log in with Google
                                        </button>
                                        <form onsubmit={(event) => log_meeting(event)}
                                              class="w-[90%] mt-4 gap-y-2 flex flex-col justify-center items-center">
                                            <div
                                                class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                <label for="meeting_link"><FiLink/></label>
                                                <input type="text" id="meeting_link"
                                                       oninput={(e) => set_link(e.target.value)}
                                                       class="bg-transparent outline-hidden w-full text-lg"
                                                       value={link()}
                                                       placeholder="Paste link here"/>
                                            </div>
                                            <div
                                                class="flex items-center w-full gap-x-2 border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                <label for="meeting_name"><FiArchive/></label>
                                                <input type="text" id="meeting_name"
                                                       oninput={(e) => set_meeting_title(e.target.value)}
                                                       class="bg-transparent outline-hidden w-full text-lg"
                                                       value={meeting_title()}
                                                       placeholder="Meeting title"/>
                                            </div>
                                            <div class="grid grid-cols-2 lg:hidden w-full">
                                                <button
                                                    type="button"
                                                    onclick={() => setFirstLast(true)}
                                                    class={clsx("p-1 text-md rounded-l border-2 border-r-[1px] border-r-gray-400 hover:border-gray-400 transition duration-300", {
                                                        "border-gray-300": !firstLast(),
                                                        "border-gray-400": firstLast()
                                                    })}>First/Last
                                                </button>
                                                <button
                                                    type="button"
                                                    onclick={() => setFirstLast(false)}
                                                    class={clsx("p-1 text-md rounded-r border-2 border-l-[1px] border-l-gray-400 hover:border-gray-400 transition duration-300", {
                                                        "border-gray-300": firstLast(),
                                                        "border-gray-400": !firstLast()
                                                    })}>Full name
                                                </button>
                                            </div>
                                            <div
                                                class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 self-start justify-between w-full">
                                                <div
                                                    class={clsx("flex w-full border-b-2 gap-x-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300", {
                                                        "hidden": firstLast(),
                                                    })}>
                                                    <label for="first_name_col" class="text-lg">F</label>
                                                    <input type="text" id="first_name_col"
                                                           oninput={(e) => set_first_name_col(e.target.value)}
                                                           class="bg-transparent outline-hidden text-lg"
                                                           value={first_name_col()}
                                                           placeholder={"Full name col"}/>
                                                </div>
                                                <div
                                                    class={clsx("flex w-full border-b-2 gap-x-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300", {
                                                        "hidden": !firstLast(),
                                                    })}>
                                                    <label for="first_name_col" class="text-lg">F</label>
                                                    <input type="text" id="first_name_col"
                                                           oninput={(e) => set_first_name_col(e.target.value)}
                                                           class="bg-transparent outline-hidden text-lg"
                                                           value={first_name_col()}
                                                           placeholder={"First name col"}/>
                                                </div>
                                                <div
                                                    class={clsx("flex w-full border-b-2 gap-x-2 border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300", {
                                                        "hidden": !firstLast(),
                                                    })}>
                                                    <label for="last_name_col" class="text-lg">L</label>
                                                    <input type="text" id="last_name_col"
                                                           oninput={(e) => set_last_name_col(e.target.value)}
                                                           class="bg-transparent outline-hidden text-lg"
                                                           value={last_name_col()}
                                                           placeholder={"Last name col"}/>
                                                </div>
                                                <div
                                                    class="flex w-full border-b-2 gap-x-2 items-center border-gray-300 hover:border-gray-400 focus-within:border-gray-400 transition duration-300">
                                                    <label for="meeting_length"><FiClock/></label>
                                                    <input type="number" id="meeting_length"
                                                           oninput={(e) => set_meeting_length(e.target.value)}
                                                           class="bg-transparent outline-hidden text-lg w-full"
                                                           value={meeting_length()}
                                                           placeholder={"Meeting length"}/>
                                                </div>
                                            </div>
                                            <div
                                                class="relative hidden lg:flex items-center justify-start w-full h-fit">
                                                <div class="flex">
                                                    <button
                                                        type="button"
                                                        onclick={() => setFirstLast(true)}
                                                        class={clsx("p-1 text-md rounded-l border-2 border-r-[1px] border-r-gray-400 hover:border-gray-400 transition duration-300", {
                                                            "border-gray-300": !firstLast(),
                                                            "border-gray-400": firstLast()
                                                        })}>First/Last
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onclick={() => setFirstLast(false)}
                                                        class={clsx("p-1 text-md rounded-r border-2 border-l-[1px] border-l-gray-400 hover:border-gray-400 transition duration-300", {
                                                            "border-gray-300": firstLast(),
                                                            "border-gray-400": !firstLast()
                                                        })}>Full name
                                                    </button>
                                                </div>
                                                <button type="submit"
                                                        class={clsx("absolute inset-x-0 justify-self-end xl:justify-self-center w-fit p-2 font-ibm text-xl transition duration-300", {
                                                            "pointer-events-none text-black/50": !button_enabled(),
                                                            "hover:shadow-lg": button_enabled(),
                                                        })}>
                                                    Log meeting
                                                </button>
                                            </div>
                                        </form>
                                        <div class="w-[90%] mt-4 text-left">
                                            <h1 class="text-md">{api_response().message}</h1>
                                            <Show when={api_response().logged}>
                                                <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <h1 class="text-md">Volunteers logged</h1>
                                                        <table class="table-auto">
                                                            {Object.entries(api_response().logged || {}).map(([person, hours], index) => (
                                                                <tr>
                                                                    <td>{index + 1}.</td>
                                                                    <td>{person}</td>
                                                                    <td>{hours} hours</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <h1 class="text-md">Volunteers not logged</h1>
                                                        <table class="table-auto">
                                                            {Object.entries(api_response().not_logged || {}).map(([person, hours], index) => (
                                                                <tr>
                                                                    <td>{index + 1}.</td>
                                                                    <td>{person}</td>
                                                                    <td>{hours} hours</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </div>
                                                </div>
                                            </Show>
                                        </div>
                                    </Match>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
            <Footer/>
        </div>
    )
}

export default KeyClubLogging;