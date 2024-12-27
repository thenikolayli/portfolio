import {createSignal, onMount, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {FiLock, FiMail, FiUser} from "solid-icons/fi";
import {clsx} from "clsx";
import axios from "axios";
import UserDataContext from "../util/Context.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import InputField from "../components/InputField.tsx";

const Register = () => {
    const [inputData, setInputData] = createSignal<{[key: string]: {[key: string]: any}}>({
        "username": {"value": "", "valid": true, "message": ""},
        "email": {"value": "", "valid": true, "message": ""},
        "password": {"value": "", "valid": true, "message": ""}
    })
    const [buttonEnabled, setButtonEnabled] = createSignal(true)
    const navigate = useNavigate();
    const context: any = useContext(UserDataContext)

    onMount(async () => {
        await context.refreshToken()
        if (context.userData() !== null) {
            navigate("/")
        }
        document.title = "Register"
    })

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        if (!buttonEnabled()) {
            return
        }
        setButtonEnabled(false)

        let newInputData = {...inputData()}
        try {
            const response = await axios({
                method: 'POST',
                url: "/api/register/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username: inputData()["username"]["value"],
                    email: inputData()["email"]["value"],
                    password: inputData()["password"]["value"],
                }
            })

            if (response.status === 201) {
                newInputData["password"]["message"] = "Account created successfully"
            }
        } catch (error: any) {
            const errors = error.response.data

            for (let error of Object.entries(errors) as any) {
                newInputData[error[0]]["valid"] = false
                newInputData[error[0]]["message"] = error[1][0]
            }
        }

        setInputData(newInputData)
        setButtonEnabled(true)
    }

    return (
        <>
            <Navbar />
            <div class="relative w-full min-h-screen bg-bg_gray flex justify-center">
                <div
                    class="absolute container font-code p-4 w-full sm:w-1/2 md:w-1/3 flex flex-col items-center top-[10%]">
                    <h1 class="text-3xl">Register</h1>
                    <form onSubmit={handleSubmit} class="container w-fit mt-4 mb-8 space-y-2">
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiUser} input="username" inputType="text" />
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiMail} input="email" inputType="text" />
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiLock} input="password" inputType="password" />
                        <button type="submit"
                                class={clsx("flex justify-self-center text-2xl font-ibm p-1 transition duration-300", {
                                    "text-black/50 pointer-events-none": !buttonEnabled(),
                                    "hover:shadow-lg": buttonEnabled(),
                                })}>Enter
                        </button>
                    </form>
                    <h1 class="mt-6 font-code text-lg">
                        By registering, you can get access to additional features unlocked by using <a href="/accesskeys" class="text-primary">access keys</a>.
                    </h1>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Register