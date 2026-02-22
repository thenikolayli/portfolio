<script>
	import Polaroid from '$lib/components/Polaroid.svelte';
	import PolaroidStack from '$lib/components/PolaroidStack.svelte';
	import { onMount } from 'svelte';

	let hobbyFocused = $state(1); // integer 1 <= n <= 3
	let hobbies = {};
	onMount(() => {
		document.title = 'Nikolay Li';
	});
</script>

<section class="main h-min-screen relative w-full">
	<div class="spacer mx-auto h-48 w-1/2"></div>
	<section class="relative mx-auto h-screen w-1/2">
		<div class="flex items-center">
			<hr class="w-12 rounded-l border-2" />
			<h1 class="mx-2 font-[Crimson-Pro] text-5xl">Hello</h1>
			<hr class="flex-1 rounded-r border-2" />
		</div>

		<div class="w-[70%] pt-4 pl-4">
			<p class="font-[Figtree] text-2xl">I am Nikolay. I'm a student, musician, and developer.</p>
		</div>

		<div class="absolute top-4 right-8 rotate-10">
			<Polaroid photoUrl="/yutaPFP.jpg" captionUrl="/yutaPFP.jpg" />
		</div>
	</section>
	<section class="relative mx-auto h-screen w-1/2">
		<div class="flex items-center">
			<hr class="w-12 border-2" />
			<h1 class="mx-2 font-[Crimson-Pro] text-5xl">Hello</h1>
			<hr class="flex-1 border-2" />
		</div>

		<div class="w-full pt-4 pl-4">
			<p class="font-[Figtree] text-2xl">I am Nikolay. I'm a student, musician, and developer.</p>
		</div>

		<div class="wrapper absolute top-4 right-0 h-100 w-1/2">
			<PolaroidStack
				polaroids={[
					{
						photoUrl: '/yutaPFP.jpg',
						captionUrl: '/yutaPFP.jpg'
					},
					{
						photoUrl: '/yutaPFP.jpg',
						captionUrl: '/yutaPFP.jpg'
					},
					{
						photoUrl: '/yutaPFP.jpg',
						captionUrl: '/yutaPFP.jpg'
					}
				]}
			/>
		</div>
	</section>
	<section class="mx-auto h-screen w-1/2">
		<div class="flex items-center">
			<hr class="w-12 border-2" />
			<h1 class="mx-2 font-[Crimson-Pro] text-5xl">Hello</h1>
			<hr class="flex-1 border-2" />
		</div>

		<div class="w-full pt-4 pl-4">
			<p class="font-[Figtree] text-2xl">I am Nikolay. I'm a student, musician, and developer.</p>
		</div>
	</section>
</section>

<!-- <style>
	.main {
		background-image: url('/bedge-grunge.png');
		background-color: var(--color-DarkCoffee);
	}
</style> -->
