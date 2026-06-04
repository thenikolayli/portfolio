<script lang="ts">
	import './layout.css';
	import favicon from '/favicon.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="circuit-bg relative min-h-screen w-full">
	<!-- Phone-width content column. On larger viewports only the side margins
	     grow; the content never reflows. -->
	<div class="mx-auto w-full max-w-[400px] px-5">
		{@render children()}
	</div>
</div>
