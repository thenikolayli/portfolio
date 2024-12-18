import {createSignal, onMount, useContext} from "solid-js";
import UserDataContext from "../util/Context.tsx";
import InputField from "../components/InputField.tsx";
import {FiLock, FiMail, FiUser} from "solid-icons/fi";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

const Register = () => {
    const [inputData, setInputData] = createSignal<{[key: string]: {[key: string]: any}}>({
        "username": {"value": "", "valid": true, "message": ""},
        "email": {"value": "", "valid": true, "message": ""},
        "password": {"value": "", "valid": true, "message": ""}
    })
    const {register} = useContext(UserDataContext)

    onMount(() => document.title = "Register")

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        const response = await register(inputData()["username"]["value"], inputData()["email"]["value"], inputData()["password"]["value"])
        let newInputData = {...inputData()}

        if (response.status !== 201) {
            const errors = response.response.data

            for (let error of Object.entries(errors) as any) {
                newInputData[error[0]]["valid"] = false
                newInputData[error[0]]["message"] = error[1][0]
            }
        } else {
            newInputData["password"]["message"] = "Account created successfully"
        }

        setInputData(newInputData)
    }

    return (
        <>
            <Navbar />
            <div class="relative w-full min-h-screen bg-bg_gray flex justify-center">
                <div
                    class="absolute container font-code p-4 w-full sm:w-1/2 md:w-1/3 flex flex-col items-center top-[10%]">
                    <h1 class="text-2xl">Register</h1>
                    <form onSubmit={handleSubmit} class="container w-fit mt-4 mb-8 space-y-2">
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiUser} input="username" inputType="text" />
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiMail} input="email" inputType="text" />
                        <InputField inputData={inputData} setInputData={setInputData} Icon={FiLock} input="password" inputType="password" />
                        <button type="submit"
                                class="flex justify-self-center text-2xl font-ibm p-1 hover:shadow-lg transition duration-300">Enter
                        </button>
                    </form>
                    <h1 class="mt-6 font-code text-lg">
                        By registering, you can get access to additional features unlocked by using <a href="/about" class="text-primary">access keys</a>.
                    </h1>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Register