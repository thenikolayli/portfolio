import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import {onMount} from "solid-js";

const NotFound = () => {
    onMount(() => document.title = "404")

    return (
        <>
            <Navbar />
            <div class="min-h-screen bg-bg_gray">
                <div class="absolute top-[30%] inset-x-0 flex flex-col justify-self-center text-center font-code">
                    <h1 class="text-4xl">404</h1>
                    <h1 class="text-2xl mt-2">
                        The page you were looking for doesn't exist.
                        <br/>
                        Return to the <a href={"/"} class={"text-primary"}>homepage</a>.
                    </h1>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default NotFound