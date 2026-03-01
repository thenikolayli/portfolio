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

<section
	class="h-min-screen mx-auto mt-30 w-full bg-bg-light p-8 shadow-lg md:w-[15%] lg:w-[25%] xl:w-[35%]"
>
	<section class="flex w-full items-center">
		<hr class="w-12 rounded-l border-2 border-highlight" />
		<h1 class="mx-2 font-[Crimson-Pro] text-5xl">Hello</h1>
		<hr class="flex-1 rounded-r border-2 border-highlight" />
	</section>

	<section class="flex h-88 w-full">
		<p class="flex-1 p-4 font-[Figtree] text-2xl">
			I'm Nikolay—a student, programmer, and musician. I create software to help others.
			<button
				class="m-1 inline-flex -rotate-2 items-center rounded-xl bg-highlight p-2 text-subtle shadow"
				>Check out my work

				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
					><g fill="none"
						><path
							d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
						/><path
							fill="currentColor"
							d="M10.5 16.035L7.404 12.94a1.5 1.5 0 1 0-2.122 2.121l5.657 5.657a1.5 1.5 0 0 0 2.122 0l5.657-5.656a1.5 1.5 0 1 0-2.122-2.122L13.5 16.035V4.5a1.5 1.5 0 0 0-3 0z"
						/></g
					></svg
				>
			</button>
		</p>

		<div class="rotate-10 py-2">
			<Polaroid photoUrl="/yutaPFP.jpg" captionUrl="/yutaPFP.jpg" />
		</div>
	</section>

	<section class="mt-8 flex w-full items-center">
		<hr class="w-12 rounded-l border-2 border-highlight" />
		<h1 class="mx-2 font-[Crimson-Pro] text-5xl">Hobbies</h1>
		<hr class="flex-1 rounded-r border-2 border-highlight" />
	</section>

	<section class="relative flex h-fit w-full flex-col">
		<div class="py-4">
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

		<p class="w-full p-4 font-[Figtree] text-2xl">
			I play guitar, my goal is to make music similar to toe someday. I also like volunteering! I
			have over 200 hours of volunteering in <a
				class="underline"
				target="_blank"
				href="https://jhskeyclub.org/">Key Club</a
			>. As the Webmaster, I maintain the club website and the Discord bot—sometimes adding new
			commands to help our Key Clubbers.
		</p>
	</section>
</section>
