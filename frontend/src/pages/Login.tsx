import {createSignal, onMount, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import {FiLock, FiUser} from "solid-icons/fi";
import InputField from "../components/InputField.tsx";
import {useNavigate} from "@solidjs/router";

const Login = () => {
    const [inputData, setInputData] = createSignal<{[key: string]: {[key: string]: any}}>({
        "username": {"value": "", "valid": true, "message": ""},
        "password": {"value": "", "valid": true, "message": ""}
    })
    const {login, refreshToken, userData} = useContext(UserDataContext)
    const navigate = useNavigate();

    onMount(async () => {
        await refreshToken()
        if (userData() !== null) {
            navigate("/")
        }
        document.title = "Login"
    })

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        let newInputData = {...inputData()}

        if (inputData()["username"]["value"] == "") {
            newInputData["username"]["message"] = "username required"
            newInputData["username"]["valid"] = false
            setInputData(newInputData)
            return
        }

        if (inputData()["password"]["value"] == "") {
            newInputData["password"]["message"] = "password required"
            newInputData["password"]["valid"] = false
            setInputData(newInputData)
            return
        }

        const response = await login(inputData()["username"]["value"], inputData()["password"]["value"])

        if (response.status !== 200) {
            newInputData["password"]["message"] = "invalid credentials"
            newInputData["username"]["valid"] = false
            newInputData["password"]["valid"] = false
        } else if (response.status == 200) {
            navigate("/")
        }

        setInputData(newInputData)
    }

    return (
        <>
            <Navbar />
            <div class="relative w-full min-h-screen bg-bg_gray flex justify-center">
                <div
                    class="absolute container font-code p-4 w-full sm:w-1/2 md:w-1/3 flex flex-col items-center top-[10%]">
                    <h1 class="text-2xl">Login</h1>
                    <form onSubmit={handleSubmit} class="container w-fit mt-4 mb-8 space-y-1">
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiUser} input="username" inputType="text" />
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiLock} input="password" inputType="password" />
                        <button type="submit" class="text-2xl font-ibm p-1 flex justify-self-center hover:shadow-lg transition duration-300">Enter
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Login