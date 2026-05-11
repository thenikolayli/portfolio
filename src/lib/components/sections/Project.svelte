<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	const pills = ['Svelte', 'GSAP', 'Tailwind'];
</script>

<section id="project" class="py-16">
	<div class="space-y-3">
		<span class="mono-label text-primary">// 03 — artifact</span>
	</div>

	<h2 class="text-foreground mt-6 mb-8 text-2xl font-bold tracking-tight">Featured Project</h2>

	<Card.Root class="overflow-hidden py-0">
		<!-- Placeholder image. Swap the inner div for an <img src="..." /> later. -->
		<div
			class="bg-muted text-muted-foreground relative flex aspect-video w-full items-center justify-center"
		>
			<div class="circuit-bg absolute inset-0 opacity-60"></div>
			<span class="mono-label relative">IMG 16:9</span>
		</div>
		<div class="space-y-4 p-5">
			<div class="space-y-1">
				<h3 class="text-foreground text-base font-semibold">Project Title</h3>
				<p class="mono-label text-primary">v0.1.0</p>
			</div>
			<p class="text-muted-foreground text-sm leading-relaxed">
				Placeholder description of the project — what it does, the problem it solves, and one
				interesting technical detail worth calling out.
			</p>
			<div class="flex flex-wrap gap-2">
				{#each pills as pill (pill)}
					<Badge variant="secondary">{pill}</Badge>
				{/each}
			</div>
		</div>
	</Card.Root>
</section>
