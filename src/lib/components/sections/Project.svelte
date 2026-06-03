<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
</script>

<section id="intro" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="03 - project" title="Home Lab" subtitle="Mini Project" />

	<Card.Root class="overflow-hidden py-0">
		<!-- Placeholder image. Swap the inner div for an <img src="..." /> later. -->
		<div
			class="relative flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground"
		>
			<img src="/proxmox_screenshot.png" alt="Proxmox screenshot" class="size-full object-cover" />
		</div>
		<div class="space-y-4 p-5">
			<p class="text-sm text-muted-foreground">
				My home lab is an Intel NUC running Proxmox VE. I have several Linux Containers (LXCs) on
				which I'm hosting the Key Club discord bot, this portfolio website, Nextcloud (personal
				Google Drive alternative), and Caddy for routing.
			</p>
		</div>
	</Card.Root>
</section>
