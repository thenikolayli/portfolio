<script lang="ts">
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';

    onMount(() => {
        document.title = "Home | Nikolay Li"
    });
</script>

<section class="w-full h-screen p-8 bg-gradient-to-t from-sky-300 to-sky-50 from-5%">
    <h1 class="text-5xl text-indigo-900">Nikolay Li</h1>
    <h2 class="text-3xl text-sky-600">Backend Developer</h2>

    <p class="text-lg text-indigo-900 mt-4">
        I build systems that make people's lives <span class="bg-amber-500 ring-4 ring-amber-500 rounded">easier.</span>
    </p>
</section>
<section class="w-full h-screen p-8 bg-gradient-to-b from-sky-300 to-sky-50 from-[1%]">
    <h1 class="text-5xl text-indigo-900 mt-8">Key Club</h1>
    <h2 class="text-3xl text-sky-600">Project Highlight</h2>

    <Card.Root class="w-full h-fit bg-sky-50 rounded shadow-lg mt-8">
        <Card.Header>
            <Card.Title>
                <h3 class="text-2xl text-indigo-900">Freshman year</h3>
            </Card.Title>
            <Card.Description>
                <p class="text-base text-sky-600">October 2024</p>
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <p class="text-base text-indigo-900">Built a Python script to automate logging Key Club events, unprompted, because the existing system was too cumbersome.</p>
        </Card.Content>
    </Card.Root>

    <Card.Root class="w-full h-fit bg-sky-50 rounded shadow-lg mt-8">
        <Card.Header>
            <Card.Title>
                <h3 class="text-2xl text-indigo-900">Elected Webmaster</h3>
            </Card.Title>
            <Card.Description>
                <p class="text-lg text-sky-600">March 2025</p>
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <p class="text-lg text-indigo-900">The club noticed, elected me to own and build the infrastructure.</p>
        </Card.Content>
    </Card.Root>

    <Card.Root class="w-full h-fit bg-sky-50 rounded shadow-lg mt-8">
        <Card.Header>
            <Card.Title>
                <h3 class="text-2xl text-indigo-900">Rebuilt it as a web app</h3>
            </Card.Title>
            <Card.Description>
                <p class="text-lg text-sky-600">July 2025</p>
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <p class="text-lg text-indigo-900">Integrated the script into a FastAPI backend within the new Key Club website.</p>
        </Card.Content>
    </Card.Root>

    <Card.Root class="w-full h-fit bg-sky-50 rounded shadow-lg mt-8">
        <Card.Header>
            <Card.Title>
                <h3 class="text-2xl text-indigo-900">Go rewrite</h3>
            </Card.Title>
            <Card.Description>
                <p class="text-lg text-sky-600">April 2026</p>
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <p class="text-lg text-indigo-900">Rewrote the backend in Go to improve performance via concurrency.</p>
        </Card.Content>
    </Card.Root>
</section>