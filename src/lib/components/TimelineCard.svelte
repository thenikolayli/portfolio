<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let {
		title,
		date,
		description,
		pills = []
	}: { title: string; date: string; description: string; pills?: string[] } = $props();
</script>

<Card.Root class="gap-4 py-5">
	<Card.Header>
		<Card.Title class="text-base">{title}</Card.Title>
		<Card.Description class="mono-label text-primary not-italic">{date}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<p class="text-muted-foreground text-sm leading-relaxed">{description}</p>
		{#if pills.length}
			<div class="flex flex-wrap gap-2">
				{#each pills as pill (pill)}
					<Badge variant="secondary">{pill}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
