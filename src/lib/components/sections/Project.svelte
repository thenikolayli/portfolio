<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
</script>

<section id="intro" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="03 - project" title="Home Lab" subtitle="Mini Project" />

	<Card.Root class="overflow-hidden py-0">
		<!-- Placeholder image. Swap the inner div for an <img src="..." /> later. -->
		<div
			class="relative flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground"
		>
			<div class="circuit-bg absolute inset-0 opacity-60"></div>
			<span class="mono-label relative">IMG 16:9</span>
		</div>
		<div class="space-y-4 p-5">
			<div class="space-y-1">
				<h3 class="text-base font-semibold text-foreground">Project Title</h3>
				<p class="mono-label text-primary">v0.1.0</p>
			</div>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Placeholder description of the project — what it does, the problem it solves, and one
				interesting technical detail worth calling out.
			</p>
			<!-- <div class="flex flex-wrap gap-2"></div> -->
		</div>
	</Card.Root>
</section>
