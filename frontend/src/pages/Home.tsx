import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import {onMount} from "solid-js";
import gsap from "gsap";

const Home = () => {
    onMount(() => {
        document.title = "Home"
        const timeline = gsap.timeline({defaults: {ease: "power1.out", y: "100%"}})

        timeline.from(".text1", {
            duration: 1,
        })

        timeline.from(".text2", {
            duration: .5,
        }, 1.2)
    })

    return (
        <div class="flex flex-col min-h-screen w-full bg-bg_gray">
            <Navbar />
            <div class="flex flex-col grow self-center items-center font-code mt-[10%] p-4 w-full sm:w-1/3">
                <div class="overflow-hidden">
                    <h1 class="text1 text-8xl">Hello</h1>
                </div>
                <div class="overflow-hidden mt-6">
                    <h1 class="text2 text-6xl text-center">Welcome to my website</h1>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Home