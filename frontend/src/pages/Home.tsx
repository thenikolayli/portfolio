import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import {onMount} from "solid-js";
import gsap from "gsap";

const Home = () => {
    onMount(() => {
        document.title = "Home"

        gsap.from("#intro_text", {
            y: "100%",
            stagger: 1.2,
            duration: 1,
            delay: .5
        })

        gsap.from("#intro_text2", {
            y: "100%",
            duration: .5,
            delay: 3
        })
    })

    return (
        <div class="flex flex-col min-h-screen w-full bg-bg_gray">
            <Navbar />
            <div class="flex flex-col flex-grow self-center items-center font-code mt-[10%] p-4 w-full sm:w-1/3">
                <div class="overflow-hidden">
                    <h1 id="intro_text" class="text-8xl">Hello</h1>
                </div>
                <div class="overflow-hidden mt-6">
                    <h1 id="intro_text" class="text-6xl text-center">Welcome to my website</h1>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Home