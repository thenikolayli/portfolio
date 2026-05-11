<script lang="ts">
    import { onMount } from 'svelte';
    import { Badge } from '$lib/components/ui/badge';
    import * as Card from '$lib/components/ui/card';
    import ExtenalLink from '@lucide/svelte/icons/external-link';

    onMount(() => {
        document.title = "Home | Nikolay Li"
    });
</script>

<section class="w-full h-screen p-8 bg-linear-to-b from-sky-50 to-sky-300 from-[2%]">
    <h1 class="text-indigo-900">Nikolay Li</h1>
    <h2 class="text-sky-600">Backend Developer</h2>

    <p class="text-indigo-900 mt-4">
        I build systems that make people's lives <span class="bg-amber-400 ring-3 ring-amber-400 rounded">easier.</span>
    </p>
</section>
<section class="w-full min-h-screen p-8 bg-gradient-to-b from-sky-300 via-sky-50 to-sky-300">
    <h1 class="text-indigo-900 mt-8">Key Club</h1>
    <h2 class="text-sky-600">Project Highlight</h2>

    <div class="grid grid-cols-12 mt-8">
        <span class="col-span-1 row-span-7 w-2 h-[calc(100%-1rem)] self-center bg-indigo-900"></span>

        <div class="col-span-11 flex items-center">
            <span class="absolute -translate-x-8 w-4 h-4 rounded-full bg-indigo-900"></span>
            <Badge class="bg-indigo-900 text-sky-50">May 2024</Badge>
        </div>
        <div class="col-span-11">
            <h3 class="text-indigo-900 mt-2">Freshman year</h3>
            <p class="text-indigo-900">Built a Python script to automate event logging using the Google Docs and Sheets APIs.</p>
            <div class="flex flex-wrap mt-2 gap-2">
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Python</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Google Docs API</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Google Sheets API</Badge>
            </div>
        </div>
        
        <div class="col-span-11 flex items-center mt-8">
            <span class="absolute -translate-x-8 w-4 h-4 rounded-full bg-indigo-900"></span>
            <Badge class="bg-indigo-900 text-sky-50">March 2025</Badge>
        </div>
        <div class="col-span-11">
            <h3 class="text-indigo-900 mt-2">Elected as Webmaster</h3>
            <p class="text-indigo-900">Built enough that the club elected me to own the technical infrastructure.</p>
        </div>
        
        <div class="col-span-11 flex items-center mt-8">
            <span class="absolute -translate-x-8 w-4 h-4 rounded-full bg-indigo-900"></span>
            <Badge class="bg-indigo-900 text-sky-50">July 2025</Badge>
        </div>
        <div class="col-span-11">
            <h3 class="text-indigo-900 mt-2">Rebuilt as a web app</h3>
            <p class="text-indigo-900">Turned the Python script into an API and connected the club website and club Discord bot to the API.</p>
            <div class="flex flex-wrap mt-2 gap-2">
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">FastAPI</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">SvelteKit</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Discord.py</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">SQLite</Badge>
            </div>
        </div>

        <div class="col-span-11 flex items-center mt-8">
            <span class="absolute -translate-x-8 w-4 h-4 rounded-full bg-indigo-900"></span>
            <Badge class="bg-indigo-900 text-sky-50">April 2026</Badge>
        </div>
        <span class="col-span-1 row-span-2 w-2 h-full"></span>
        <div class="col-span-11">
            <h3 class="text-indigo-900 mt-2">Go rewrite</h3>
            <p class="text-indigo-900">Moved the API to a Discord bot in Go to improve performance via concurrency, simplify use for members, and added new Google Calendar features.</p>
            <div class="flex flex-wrap mt-2 gap-2">
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Go</Badge>
                <Badge class="border-sky-200 bg-sky-50 text-sky-600">Google Calendar API</Badge>
            </div>
        </div>
    </div>

    <Card.Root class="mt-8 border-sky-200 border-1 bg-sky-50">
        <Card.Header>
            <Card.Title>
                <h3 class="text-indigo-900">Links</h3>
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <ul>
                <li>
                    <a href="https://jhskeyclub.org" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Key Club website
                    </a>
                </li>
                <li>
                    <a href="https://github.com/thenikolayli/keyclubDiscordBot" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Discord bot repository
                    </a>
                </li>
                <li>
                    <a href="https://github.com/thenikolayli/keyclub_website" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Website repository
                    </a>
                </li>
            </ul>
        </Card.Content>
    </Card.Root>
</section>
<section class="w-full min-h-screen p-8 bg-linear-to-b from-sky-300 to-sky-50 from-[2%]">
    <h1 class="text-indigo-900 mt-8">Home Lab</h1>
    <h2 class="text-sky-600">Project Highlight</h2>

    <p class="text-indigo-900 mt-4">
        My home lab is an Intel NUC running Proxmox VE. I use it to test my website updates before rolling them out, as well as to host a variety of services.
    </p>
    <img src="/proxmox_screenshot.png" alt="Proxmox VE screenshot" class="w-full h-auto">

    <Card.Root class="mt-8 border-sky-200 border-1 bg-sky-50">
        <Card.Header>
            <Card.Title>
                <h3 class="text-indigo-900">Links</h3>
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <ul>
                <li>
                    <a href="https://jhskeyclub.org" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Key Club website
                    </a>
                </li>
                <li>
                    <a href="https://github.com/thenikolayli/keyclubDiscordBot" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Discord bot repository
                    </a>
                </li>
                <li>
                    <a href="https://github.com/thenikolayli/keyclub_website" target="_blank" class="flex items-center text-indigo-900 gap-1 hover:underline">
                        <ExtenalLink size={20} />
                        Website repository
                    </a>
                </li>
            </ul>
        </Card.Content>
    </Card.Root>
</section>