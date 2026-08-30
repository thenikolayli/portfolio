<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
	import CustomBadge from '$lib/components/CustomBadge.svelte';
</script>

<section id="homelab" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="03 - project" title="Home lab" subtitle="Mini project" />

	<Card.Root class="pt-0">
		<div class="space-y-4 p-5">
			<p class="text-sm text-muted-foreground">
				My home lab is an Intel NUC running Proxmox.
				<br />
				<br />
				I have an LXC running Seafile server on it. My Seafile files are stored inside an LVM that's mounted
				inside the LXC. Tailscale is also running inside the LXC and the PVE Node, so my devices have
				exclusive access to my home lab and Seafile from anywhere.
			</p>
		</div>
		<Card.Footer>
			<div class="flex flex-wrap gap-2">
				<CustomBadge variant="Proxmox" />
				<CustomBadge variant="Seafile" />
				<CustomBadge variant="Tailscale" />
			</div>
		</Card.Footer>
	</Card.Root>
</section>
