<script lang="ts">
	import './layout.css';
	import * as ToolTip from '$lib/components/ui/tooltip/index.js';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

<div class="circuit-bg relative min-h-screen w-full">
	<div class="mx-auto w-full max-w-100 px-5">
		<ToolTip.Provider>
			{@render children()}
		</ToolTip.Provider>
	</div>
</div>
