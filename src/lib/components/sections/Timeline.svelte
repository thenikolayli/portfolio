<script lang="ts">
	import { gsap } from 'gsap';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { onMount } from 'svelte';
	import CustomBadge from '$lib/components/ui/CustomBadge.svelte';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let rail: HTMLElement | null = null;
	let progress: HTMLElement | null = null;
	let nodes: HTMLElement[] = [];

	const cards = [
		{
			title: 'Member',
			subtitle: 'October 2024',
			content:
				'Wrote a Python script to automate logging Key Club events, unprompted, because the existing system was too cumbersome.',
			badges: ['Python', 'Google APIs']
		},
		{
			title: 'Elected Webmaster',
			subtitle: 'March 2025',
			content: 'The club noticed, elected me to bulid and maintain the infrastructure.'
		},
		{
			title: 'Rebuilt as web app',
			subtitle: 'July 2025',
			content:
				'Turned the Python script into an API and connected the club website and club Discord bot to the API.',
			badges: ['FastAPI', 'SQLite', 'SvelteKit']
		},
		{
			title: 'Go rewrite',
			subtitle: 'April 2026',
			content:
				'Moved the functionality to a Discord bot rewritten in Go, to improve accessibility and performance.',
			badges: ['Go', 'DiscordGo']
		}
	];

	const resizeRails = () => {
		const firstNode = nodes[0];
		const lastNode = nodes[nodes.length - 1];
		if (!firstNode || !lastNode) return;

		const firstNodeRect = firstNode.getBoundingClientRect();
		const lastNodeRect = lastNode.getBoundingClientRect();
		const height = lastNodeRect.top - firstNodeRect.top;
		gsap.set(rail, { height: height });
	};

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
	<SectionHeader section="02 - timeline" title="Key Club Website" subtitle="Project Highlight" />

	<div class="relative">
		<div bind:this={rail} class="absolute top-4 left-1.5 w-0.5 bg-border"></div>
		<div bind:this={progress} class="absolute top-4 left-1.5 w-1 origin-top bg-primary"></div>

		<ol class="space-y-6">
			{#each cards as card}
				<li class="relative pl-9">
					<span
						class="node absolute top-3 left-0 size-4 rounded-full border-2 border-primary bg-background"
					></span>
					<Card.Root>
						<Card.Header>
							<Card.Title>{card.title}</Card.Title>
							<Card.Description>{card.subtitle}</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>{card.content}</p>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each card.badges as badge}
									<CustomBadge variant={badge} />
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				</li>
			{/each}
		</ol>
	</div>
</section>
