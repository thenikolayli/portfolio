<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { Attachment } from 'svelte/attachments';
	import TimelineCard from '$lib/components/TimelineCard.svelte';
	import Divider from '$lib/components/decor/Divider.svelte';

	const items = [
		{
			title: 'Role / Milestone One',
			date: '2024 — Present',
			description:
				'Placeholder description of this role or milestone. Summarize the scope, the impact, and a notable outcome in a sentence or two.',
			pills: ['TypeScript', 'Svelte', 'PostgreSQL']
		},
		{
			title: 'Role / Milestone Two',
			date: '2022 — 2024',
			description:
				'Placeholder description. Replace with what you worked on, the team or product, and the technologies involved.',
			pills: ['Python', 'FastAPI', 'Docker']
		},
		{
			title: 'Role / Milestone Three',
			date: '2020 — 2022',
			description:
				'Placeholder description. Highlight a key project, a metric you moved, or a system you designed.',
			pills: ['Go', 'Kubernetes', 'gRPC']
		},
		{
			title: 'Role / Milestone Four',
			date: '2018 — 2020',
			description:
				'Placeholder description. The earliest node — where it started. Swap in your own copy here.',
			pills: ['C++', 'Linux', 'CMake']
		}
	];

	// Drives the scroll-linked progress bar fill and per-card reveals via GSAP.
	const timelineAnimation: Attachment<HTMLElement> = (node) => {
		gsap.registerPlugin(ScrollTrigger);

		const progressEl = node.querySelector<HTMLElement>('[data-progress]');
		const listEl = node.querySelector<HTMLElement>('[data-list]');
		if (!progressEl || !listEl) return;

		const mm = gsap.matchMedia();

		mm.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.fromTo(
				progressEl,
				{ scaleY: 0 },
				{
					scaleY: 1,
					ease: 'none',
					scrollTrigger: { trigger: node, start: 'top 70%', end: 'bottom 65%', scrub: true }
				}
			);

			const cards = gsap.utils.toArray<HTMLElement>(listEl.children);
			cards.forEach((card) => {
				gsap.from(card, {
					opacity: 0,
					y: 24,
					duration: 0.5,
					ease: 'power2.out',
					scrollTrigger: { trigger: card, start: 'top 88%' }
				});
			});
		});

		mm.add('(prefers-reduced-motion: reduce)', () => {
			gsap.set(progressEl, { scaleY: 1 });
		});

		return () => mm.revert();
	};
</script>

<section id="work" class="py-16">
	<Divider label="02 - timeline" />

	<header class="space-y-2 font-sans">
		<h2 class="text-foreground text-2xl font-semibold tracking-tight">
			Backend Developer
		</h2>
		<p class="text-muted-foreground text-lg">Nikolay Li</p>
	</header>

	<div class="relative" {@attach timelineAnimation}>
		<!-- Rail track -->
		<div class="bg-border absolute top-1 bottom-1 left-[6px] w-px"></div>
		<!-- Scroll-driven progress fill -->
		<div
			data-progress
			class="bg-primary absolute top-1 bottom-1 left-[5px] w-[3px] origin-top"
			style="transform: scaleY(0)"
		></div>

		<ol data-list class="space-y-6">
			{#each items as item (item.title)}
				<li class="relative pl-9">
					<span
						class="border-primary bg-background absolute top-3 left-0 size-[13px] rounded-full border-2"
					></span>
					<TimelineCard
						title={item.title}
						date={item.date}
						description={item.description}
						pills={item.pills}
					/>
				</li>
			{/each}
		</ol>
	</div>
</section>
