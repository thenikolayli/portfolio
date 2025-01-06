import { FiGithub, FiInstagram } from "solid-icons/fi";

const Footer = () => (
    <div class="flex w-full p-2 gap-x-2 font-code text-lg">
        <a href="https://github.com/thenikolayli/" target={"_blank"}><FiGithub class={"size-6"} stroke-width={1.3}/></a>
        <a href="https://instagram.com/thenikolayli/" target={"_blank"}><FiInstagram class={"size-6"}
                                                                                     stroke-width={1.3}/></a>
        <a href="https://nikolayli.com" target={"_blank"}>nikolayli.com</a>
        {/*<h1 class="font-barcode">lorem ipsum lor</h1>*/}
    </div>
)

export default Footer