<script lang="ts">
	import Intro from '$lib/components/sections/Intro.svelte';
	import Timeline from '$lib/components/sections/Timeline.svelte';
	import Project from '$lib/components/sections/Project.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		document.title = 'Nikolay Li - Portfolio';
	});
</script>

<main>
	<Intro />
	<Timeline />
	<Project />
	<Contact />
</main>
