<script>
	import { onMount } from 'svelte';
	import Polaroid from './Polaroid.svelte';
	import gsap from 'gsap';

	let { polaroids } = $props();
	let polaroidBinds = [];
	const percentShift = 10;

	onMount(() => {
		const median = Math.floor(polaroidBinds.length / 2);
		Object.values(polaroidBinds).forEach((bind, index) => {
			if (index < median) {
				gsap.set(bind, {
					rotation: -3
				});
			} else if (index > median) {
				gsap.set(bind, {
					rotation: 3
				});
			}
		});
	});

	const onMouseEnter = (index) => {
		gsap.set(polaroidBinds[index], {
			zIndex: 20
		});
		if (index > 0) {
			gsap.to(polaroidBinds[index - 1], {
				xPercent: -percentShift,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
		if (index < polaroidBinds.length - 1) {
			gsap.to(polaroidBinds[index + 1], {
				xPercent: percentShift,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
	};

	const onMouseLeave = (index) => {
		gsap.set(polaroidBinds[index], {
			zIndex: 10
		});
		if (index > 0) {
			gsap.to(polaroidBinds[index - 1], {
				xPercent: 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
		if (index < polaroidBinds.length - 1) {
			gsap.to(polaroidBinds[index + 1], {
				xPercent: 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
	};
</script>

<section class="flex h-full w-full shrink-0 justify-center">
	{#each polaroids as polaroid, index}
		<div
			bind:this={polaroidBinds[index]}
			class="relative z-10 -mx-8 h-fit w-fit"
			onmouseenter={() => onMouseEnter(index)}
			onmouseleave={() => onMouseLeave(index)}
			role="note"
		>
			<Polaroid
				photoUrl={polaroid.photoUrl}
				captionUrl={polaroid.captionUrl}
				disableAnimation={false}
			/>
		</div>
	{/each}
</section>
