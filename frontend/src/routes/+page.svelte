<script>
    import Dots from "$lib/components/Dots.svelte"
    import Icon from "@iconify/svelte"
    import {onMount} from "svelte";
    import WhatIUse from "$lib/components/WhatIUse.svelte";
    import Project from "$lib/components/Project.svelte";

    onMount(() => {
        document.title = "Nikolay Li"
    })
</script>

<!--<Dots/>-->
<section class="relative w-full min-h-screen bg-transparent z-10 space-y-4 px-8 lg:px-0">
    <section class="relative top-[10vh] w-full lg:w-1/2 p-4 mx-auto shadow-lg bg-gradient-to-b from-bg-light to-bg from-10%">
        <header class="relative container w-full h-[130px]">
            <img src="/self.webp" alt="Me!" class="h-full mr-2 float-left">
            <div class="h-full flex flex-col items-stretch justify-between">
                <h1 class="text-5xl">Hey, I'm Nikolay.</h1>
                <span class="flex text-xl text-text-muted items-center"><Icon class="mr-1" icon="heroicons:map-pin" />Seattle, WA</span>
            </div>
        </header>
        <p class="text-left text-3xl text-text-muted mt-6 font-light mt-8">
            I'm a programmer that makes websites, bots, and tools.
            I like to help others with programming.
        </p>
    </section>

    <section class="relative top-[10vh] w-full lg:w-1/2 p-4 mx-auto shadow-lg bg-gradient-to-b from-bg-light to-bg from-10%">
        <h1 class="text-4xl">Here's what I use.</h1>

        <section class="flex flex-wrap justify-start mt-8 gap-4 w-full">
            <WhatIUse src="/tools/css.webp" name="CSS" />
            <WhatIUse src="/tools/django.webp" name="Django" />
            <WhatIUse src="/tools/docker.webp" name="Docker" />
            <WhatIUse src="/tools/fastapi.webp" name="Fast API" />
            <WhatIUse src="/tools/google.webp" name="Google APIs" />
            <WhatIUse src="/tools/html.webp" name="HTML" />
            <WhatIUse src="/tools/java.webp" name="Java" />
            <WhatIUse src="/tools/js.webp" name="JavaScript" />
            <WhatIUse src="/tools/meta.webp" name="Meta APIs" />
            <WhatIUse src="/tools/mongodb.webp" name="Mongo DB" />
            <WhatIUse src="/tools/nginx.webp" name="Nginx" />
            <WhatIUse src="/tools/python.webp" name="Python" />
            <WhatIUse src="/tools/solidjs.webp" name="Solid JS" />
            <WhatIUse src="/tools/svelte.webp" name="Svelte Kit" />
            <WhatIUse src="/tools/tailwind.webp" name="Tailwind CSS" />
        </section>
    </section>

    <section class="relative top-[10vh] w-full lg:w-1/2 p-4 mx-auto shadow-lg bg-gradient-to-b from-bg-light to-bg from-10%">
        <h1 class="text-4xl mb-8">Here's what I made.</h1>
        <Project src="/projects/kcwebsite.png" title="JHS Key Club Website"
                 link="https://jhskeyclub.org"
                 github_link="https://github.com/thenikolayli/keyclub_website"
                 description="
                 I'm the webmaster of my high school's Key Club (volunteering club) and I made our website.
                 It has info regarding membership, upcoming volunteer events, and checking how many volunteer hours you have.
                 "
                 tools_used={{
                    FastAPI: "/tools/fastapi.webp",
                    SvelteKit: "/tools/svelte.webp",
                    TailwindCSS: "/tools/tailwind.webp",
                    GoogleAPIs: "/tools/google.webp",
                    Nginx: "/tools/nginx.webp",
                 }}
        />
    </section>

    <section class="w-full h-screen"></section>
</section>