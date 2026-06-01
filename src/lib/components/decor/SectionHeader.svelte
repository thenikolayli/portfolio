<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		section,
		title,
		subtitle,
		size = 'lg'
	}: { section: string; title: string; subtitle: string; size?: 'lg' | 'xl' } = $props();
</script>

<div class="flex flex-col">
	<span class="font-mono text-primary">// {section}</span>
	<span class="font-barcode text-4xl text-muted-foreground">// {section}</span>

	{#if size === 'xl'}
		<header class="font-sans">
			<h1 class="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
			<p class="text-lg text-muted-foreground">{subtitle}</p>
		</header>
	{:else}
		<header class="font-sans">
			<h1 class="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
			<p class="text-lg text-muted-foreground">{subtitle}</p>
		</header>
	{/if}
</div>
