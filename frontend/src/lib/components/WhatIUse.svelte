<script>
    import {onMount} from "svelte";
    import {gsap} from "gsap";

    let {src, name} = $props();
    let box
    let original
    let filtered
    let infowrapper
    let info
    let animation

    onMount(() => {
        gsap.set(filtered, {
            width: original.clientWidth,
            height: original.clientHeight,
            filter: "grayscale(100%) sepia(100%) saturate(100%)",
            opacity: 1
        })

        const ribbon_on_right = box.getBoundingClientRect().right + 200 < innerWidth

        gsap.set(infowrapper, {
            left: ribbon_on_right ? 100 : -200
        })

        gsap.set(info, {
            x: ribbon_on_right ? -info.clientWidth : 200
        })

        animation = gsap.timeline({paused: true})
        animation.to(filtered, {
            opacity: 0,
            duration: .3,
            ease: "power1.out"
        })
        animation.to(info, {
            x: ribbon_on_right ? 0 : 200 - info.clientWidth,
            duration: .3,
            ease: "power2.out",
        })
    })
</script>

<section class="relative">
    <div bind:this={box} class="relative w-[100px] h-[100px] aspect-square shadow p-4 border-2 border-t-highlight border-bg-dark bg-gradient-to-b from-bg to-bg-dark from-10%"
         onmouseover={() => animation.play()} onmouseout={() => animation.reverse()}
         onfocus={() => animation.play()} onblur={() => animation.reverse()}
         role="button" tabindex="0"
    >
        <img bind:this={original} src={src} alt={name} class="relative z-[0] w-full h-full object-contain">
        <img bind:this={filtered} src={src} alt={name} class="absolute z-[1] top-4 left-4 z-0 object-contain">
    </div>

    <div bind:this={infowrapper} class="absolute z-[2] h-[100px] w-[200px] top-0 left-[100px] overflow-hidden pointer-events-none">
        <span bind:this={info} class="absolute h-full w-fit max-w-[200px] p-4 text-2xl text-highlight break-words bg-info">
            {name}
        </span>
    </div>
</section>