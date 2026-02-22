<script>
	let { photoUrl, captionUrl, disableAnimation = false } = $props();
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	let polaroid;

	const onMouseEnter = () => {
		gsap.to(polaroid, {
			scale: 1.05,
			duration: 0.3,
			ease: 'power1.out'
		});
		gsap.to(polaroid, {
			rotation: Math.floor(Math.random() * 2) === 1 ? 3 : -3,
			duration: 0.3,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: 3
		});
	};

	const onMouseLeave = () => {
		gsap.killTweensOf(polaroid);
		gsap.to(polaroid, {
			scale: 1,
			rotation: 0,
			duration: 0.3,
			ease: 'power1.out'
		});
	};
</script>

<section
	bind:this={polaroid}
	onmouseenter={() => !disableAnimation && onMouseEnter()}
	onmouseleave={() => !disableAnimation && onMouseLeave()}
	role="note"
	class="flex h-88 w-62 flex-col overflow-hidden bg-white p-4 shadow-lg outline-1 outline-black/20"
>
	<img src={photoUrl} alt="" class="aspect-square w-full object-contain" />
	<img src={captionUrl} alt="" class="min-h-0 w-full flex-1 object-fill" />
</section>
