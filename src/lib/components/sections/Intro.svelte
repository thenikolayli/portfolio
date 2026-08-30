<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
</script>

<section id="intro" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="01 - intro" title="Student" subtitle="Nikolay Li" size="xl" />

	<p class="text-base leading-relaxed text-muted-foreground">
		High school student building software in a club context.
	</p>

	<Button href="#work" size="lg" variant="default">View my work</Button>
</section>
