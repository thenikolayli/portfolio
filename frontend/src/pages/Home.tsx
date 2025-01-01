import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import {createSignal, onMount} from "solid-js";
import FlashWordManager from "../components/FlashWordManager.tsx";

const Home = () => {
    onMount(() => document.title = "Home")
    const [showSignal, setShowSignal] = createSignal(false);
    const baseProps = {
        size: "lg",
        textcolor: "black",
        bgcolor: "black",
    }

    onMount(() => setInterval(() => setShowSignal(true), 1000))

    return (
        <>
            <Navbar/>
            <div class="relative w-full min-h-screen bg-bg_gray font-code flex justify-center">
                <div class="absolute container p-4 w-full md:w-1/2 flex flex-col justify-center text-center top-[10%]">
                    <h1 class="text-2xl">Home Page</h1>
                    <h1 class="text-xl mt-4 text-left">
                        This is my website. I will be working on it to grow my
                        programming and web dev skills, as well as showcase my code and personal style.
                    </h1>

                    <div class="flex flex-wrap">
                        <FlashWordManager baseProps={baseProps} words={`
                        Smack it up, flip it, pulled out, 'bout to fail
                        Sunday in the ATL and I'm all outta ale
                        Like a bat out of hell, tripped on a cat tail
                        Mutt drinkin' out a pail, who let the rat out the cell?`} showSignal={showSignal} />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Home