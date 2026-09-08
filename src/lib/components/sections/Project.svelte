<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CustomBadge from '$lib/components/CustomBadge.svelte';
	import TinyToolTip from '$lib/components/TinyToolTip.svelte';
</script>

<section id="homelab" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<header class="font-sans">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Home Lab</h1>
		<p class="text-lg text-muted-foreground">My home lab, currently</p>
	</header>

	<Card.Root class="pt-0">
		<div class="space-y-4 p-5">
			<span class="text-sm text-muted-foreground">
				My home lab is an Intel <TinyToolTip
					class="text-orange-500"
					trigger="NUC"
					content="Next Unit of Computing"
				/> running Proxmox.
				<br />
				<br />
				I have an array of <TinyToolTip
					class="text-orange-500"
					trigger="LXCs"
					content="Linux Containers"
				/> where I self-host the following:
				<ul class="list-inside list-disc">
					<li>Seadrive - Google Drive alternative</li>
					<li>Dokploy - Vercel alternative</li>
					<li>This website - managed by Dokploy</li>
					<li>Uptime Kuma - uptime monitoring tool</li>
				</ul>
				<br />
				I use Seadrive to offload large files and videos from my phone/laptop to free up storage. I set
				up a Discord webhook to receive notifications when a build or deployment fail or when one of my
				services go down.
			</span>
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
