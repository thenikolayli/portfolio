<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { variant } = $props();
</script>

{#if variant === 'Go'}
	<Badge variant="pill" class="border-primary bg-transparent">
		<img src="/svg/go.svg" alt="Go" class="size-full object-contain" />
	</Badge>
{:else if variant === 'Python'}
	<Badge variant="pill" class="border-primary bg-transparent">
		<img src="/svg/python.svg" alt="Python" class="size-full object-contain" />
	</Badge>
{:else if variant === 'FastAPI'}
	<Badge variant="pill" class="border-[#05988a] bg-transparent">
		<img src="/svg/fastapi.svg" alt="FastAPI" class="size-full object-contain" />
	</Badge>
{:else if variant === 'SQLite'}
	<Badge variant="pill" class="border-[#0f80cc] bg-transparent">
		<img src="/svg/sqlite.svg" alt="SQLite" class="size-full object-contain" />
		SQLite
	</Badge>
{:else if variant === 'SvelteKit'}
	<Badge variant="pill" class="border-[#fe5e2a] bg-transparent p-0.5">
		<img src="/svg/sveltekit.svg" alt="SvelteKit" class="size-full object-contain" />
	</Badge>
{:else if variant === 'DiscordGo'}
	<Badge variant="pill" class="border-[#7289da] bg-transparent p-1 text-[#7289da]">
		{variant}
	</Badge>
{:else if variant === 'Proxmox'}
	<Badge variant="pill" class="border-primary bg-transparent p-1">
		<img src="/svg/proxmox.svg" alt="Proxmox" class="size-full object-contain" />
	</Badge>
{:else if variant === 'Seafile'}
	<Badge variant="pill" class="border-primary bg-transparent p-1">
		<img src="/svg/seafile.webp" alt="Seafile" class="size-full object-contain" />
	</Badge>
{:else if variant === 'Tailscale'}
	<Badge variant="pill" class="border-primary bg-transparent p-1">
		<img src="/svg/tailscale.webp" alt="Tailscale" class="size-full object-contain" />
	</Badge>
{:else if variant === 'Google APIs'}
	<Badge variant="pill" class="gap-0 border-[#4086f4]">
		<span class="text-[#4086f4]">G</span>
		<span class="text-[#eb4132]">o</span>
		<span class="text-[#fbbd00]">o</span>
		<span class="text-[#4086f4]">g</span>
		<span class="text-[#31aa52]">l</span>
		<span class="mr-1 text-[#eb4132]">e</span>
		APIs
	</Badge>
{:else}
	<Badge variant="pill">{variant}</Badge>
{/if}
