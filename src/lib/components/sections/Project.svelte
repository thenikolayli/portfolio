<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CustomBadge from '$lib/components/CustomBadge.svelte';
	import TinyToolTip from '$lib/components/TinyToolTip.svelte';
</script>

<section id="homelab" class="flex min-h-screen flex-col justify-center gap-6 py-20">
    <header class="font-sans">
    	<h1 class="text-2xl font-semibold tracking-tight text-foreground">
            Home Lab
        </h1>
    	<p class="text-lg text-muted-foreground">
            My
            <TinyToolTip trigger="NAS" content="Network Attached Storage" />
            , currently
        </p>
    </header>

	<Card.Root class="pt-0">
		<div class="space-y-4 p-5">
			<p class="text-sm text-muted-foreground">
				My home lab is an Intel <TinyToolTip trigger="NUC" content="Network Unit of Computing" /> running Proxmox.
				<br />
				<br />
				I have an <TinyToolTip trigger="LXC" content="Linux Container" /> running Seafile server on it. My Seafile files are stored inside an <TinyToolTip trigger="LVM" content="Logical Volume Manager" /> that's mounted
				inside the LXC. Tailscale is also running inside the LXC and the <TinyToolTip trigger="PVE" content="Proxmox Virtual Environment" /> Node, so my devices have
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
