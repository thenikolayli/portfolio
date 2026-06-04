<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

<div class="circuit-bg relative min-h-screen w-full">
	<div class="mx-auto w-full max-w-[400px] px-5">
		{@render children()}
	</div>
</div>
