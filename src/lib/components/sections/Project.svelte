<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
</script>

<section id="intro" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="03 - project" title="Home lab" subtitle="Mini project" />

	<Card.Root class="py-0">
		<!-- <div
			class="relative flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground"
		>
			<img src="/proxmox_screenshot.png" alt="Proxmox screenshot" class="size-full object-cover" />
		</div> -->
		<div class="space-y-4 p-5">
			<p class="text-sm text-muted-foreground">
			    My home lab is an Intel NUC running Proxmox.
				<br>
				<br>
				I have an LXC running Seafile server on it.
			    My Seafile files are stored inside an LVM that's mounted inside the LXC. Tailscale is also
				running inside the LXC and the PVE Node, so my devices have exclusive access to
				my home lab and Seafile from anywhere.
			</p>
		</div>
	</Card.Root>
</section>
