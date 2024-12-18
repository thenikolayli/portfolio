import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import {onMount} from "solid-js";

const Home = () => {
    onMount(() => document.title = "Home")

    return (
        <>
            <Navbar/>
            <div class="relative w-full min-h-screen bg-bg_gray font-code flex justify-center">
                <div class="absolute container p-4 w-full md:w-1/2 flex flex-col justify-center text-center top-[10%]">
                    <h1 class="text-2xl">Home Page</h1>
                    <h1 class="text-xl mt-4 text-left">This is my website. I will be working on it to expand my
                        programming and web dev skills, as well as showcase my code and personal style.</h1>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Home