<script lang="ts">
	import { gsap } from 'gsap';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { onMount } from 'svelte';
	import CustomBadge from '$lib/components/CustomBadge.svelte';
	import GithubIcon from '$lib/components/decor/GithubIcon.svelte';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let rail: HTMLElement | null = null;
	let progress: HTMLElement | null = null;
	let nodes: HTMLElement[] = [];

	const cards = [
		{
			title: 'Python script - Fall 2024',
			content: 'Wrote a Python script to automate logging volunteer hours and events.',
			why: `The club vice president, at the time, spent hours each week manually logging hours and events for hundreds of members.

			My script used the user's Google account to read and parse attendance documents and write that information to the club spreadsheet.
			`,
			badges: ['Python', 'Google APIs'],
			repo: ''
		},
		{
			title: 'Discord bot - July 2025',
			content: `Made a Discord bot to act as a frontend for the Python script.`,
			why: `The club had a Discord server, so I wrote a Discord bot and turned the Python script's functionality into slash commands.

			The Discord bot used the roles in the Discord server for authorization, so regular members couldn't use the logging functionality.

			I had to use a Google Service Account to make this possible (so users wouldn't need to log in with their own).
			`,
			badges: ['Go', 'DiscordGo'],
			repo: 'https://github.com/thenikolayli/keyclubDiscordBot'
		},
		{
			title: 'Go API - May 2026',
			content: `Created a Go API and connected the club website and Discord bot to it.`,
			why: `Since I was elected as the webmaster, I wanted the club website to have the same functionality as the Discord bot.

			I used SQLite as the database (for storing club member hours and other information for quick lookup) and net/http to make the API.

			Since the logging functionality was now available on the website, I needed to add authentication and authorization. I decided to roll out my own session-based magic link system via Maizzle email templates and Google's SMTP using the club Gmail account.

			I turned the Discord bot's functionality into a Go API so the website could use it and rewrote the bot to rely on the API to prevent inconsistencies with the data between the website and the bot.
			`,
			badges: ['Go', 'SQLite'],
			repo: 'https://github.com/thenikolayli/keyclub-api'
		},
		{
			title: 'Full stack rewrite - August 2026',
			content: `Consolidated software into one SvelteKit app.`,
			why: `The Discord server was inactive and nearly all communication happened through Instagram, so the officers decided to remove the Discord server.

			I also realized the next webmaster would need to be proficient in Go and Javascript, so I decided to simplify the stack by rewriting the API in TypeScript using SvelteKit.

			Supabase killed two birds with one stone: replacing my custom auth system with a simpler, more secure one, and replacing SQLite with a more robust solution that had a built-in webui table editor.

			Furthermore, this meant I could move everything off my home lab and onto the cloud, where Supabase is hosted on Supabase and the SvelteKit app is hosted on Vercel. That way, the next webmaster would not need to have their own home lab to keep the club website running.
			`,
			badges: ['SvelteKit'],
			repo: 'https://github.com/thenikolayli/keyclub-web'
		}
	];

	function resizeRails() {
		const firstNode = nodes[0];
		const lastNode = nodes[nodes.length - 1];
		if (!firstNode || !lastNode) return;

		const firstNodeRect = firstNode.getBoundingClientRect();
		const lastNodeRect = lastNode.getBoundingClientRect();
		const height = lastNodeRect.top - firstNodeRect.top;
		gsap.set(rail, { height: height });
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		nodes = gsap.utils.toArray<HTMLElement>('.node');
		resizeRails();
		window.addEventListener('resize', resizeRails);

		gsap.set(progress, { height: 0 });
		gsap.to(progress, {
			height: gsap.getProperty(rail, 'height'),
			ease: 'none',
			scrollTrigger: {
				trigger: '#work',
				start: 'top top',
				end: 'center top',
				scrub: 1,
				once: true
			}
		});

		return () => {
			window.removeEventListener('resize', resizeRails);
		};
	});
</script>

<section id="work" class="flex min-h-screen flex-col justify-center gap-6 py-16">
	<SectionHeader section="02 - timeline" title="Key Club App" subtitle="Project Highlight" />

	<div class="relative">
		<div bind:this={rail} class="absolute top-6 left-1.5 w-0.5 bg-border"></div>
		<div bind:this={progress} class="absolute top-6 left-1.5 w-1 origin-top bg-primary"></div>

		<ol class="space-y-6">
			{#each cards as card}
				<li class="relative pl-9">
					<span
						class="node absolute top-3 left-0 size-4 rounded-full border-2 border-primary bg-background"
					></span>
					<Card.Root>
						<Card.Header>
							<Card.Title>{card.title}</Card.Title>
							{#if card.repo !== ''}
								<Card.Action>
									<a
										href={card.repo}
										target="_blank"
										rel="noreferrer"
										class="text-muted-foreground transition-colors hover:text-primary"
										aria-label={`View ${card.title} on GitHub`}
									>
										<GithubIcon class="size-5" />
									</a>
								</Card.Action>
							{/if}
						</Card.Header>
						<Card.Content>
							<p>{card.content}</p>
						</Card.Content>
						<Card.Content>
							<Accordion.Root type="single" onValueChange={resizeRails}>
								<Accordion.Item value="why" class="border-0">
									<Accordion.Trigger class="cursor-pointer px-0 text-muted-foreground"
										>Why</Accordion.Trigger
									>
									<Accordion.Content class="pt-0 whitespace-pre-line text-card-foreground"
										>{card.why}</Accordion.Content
									>
								</Accordion.Item>
							</Accordion.Root>
						</Card.Content>
						<Card.Footer>
							<div class="flex flex-wrap gap-2">
								{#each card.badges as badge}
									<CustomBadge variant={badge} />
								{/each}
							</div>
						</Card.Footer>
					</Card.Root>
				</li>
			{/each}
		</ol>
	</div>
</section>
