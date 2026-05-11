<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Divider from '$lib/components/decor/Divider.svelte';
</script>

<section id="intro" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<Divider label="01 - intro" />	

	<header class="space-y-2 font-sans">
		<h1 class="text-foreground text-4xl font-semibold tracking-tight">
			Backend Developer
		</h1>
		<p class="text-muted-foreground text-lg">Nikolay Li</p>
	</header>

	<p class="text-muted-foreground text-base leading-relaxed">
		High school student building software in a club context.
	</p>

	<div>
		<Button
			href="#work"
			size="lg"
			variant="default"
		>
			View my work
		</Button>
	</div>
</section>
