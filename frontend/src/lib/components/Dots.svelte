<script>
    import {onMount} from "svelte";

    let canvas // canvas
    let ctx // canvas 2d context

    const mradius = 200 // radius around mouse in which dots will change
    let mx = $state(0) // mouse x
    let my = $state(0) // mouse y

    const dotspace = 100 // space between dots
    let dotsx = $state(0) // # of dots on the x
    let dotsy = $state(0) // # of dots on the y
    let offsetx = $state(0) // x offset to center dots
    let offsety = $state(0) // y offset to center dots

    const dot_size = 15 // size of the dots
    const colors = {in: "oklch(0.7 0.09 139)", out: "oklch(0.8 0.09 139)"} // dot colors, in radius and outside radius
    let off_canvas = {} // off canvas

    onMount(() => {
        resize_canvas() // resizes canvas to screen size
        ctx = canvas.getContext("2d")
        Promise.all(Object.keys(colors).map((color) => create_bitmap(color))).then(() => animate()) // waits for all dot colors to be rasterized

        addEventListener("mousemove", (event) => {
            mx = event.clientX
            my = event.clientY + scrollY // scrollY because you only scroll on the Y on this website
        })
        addEventListener("resize", resize_canvas)

        return () => {
            removeEventListener("mousemove")
            removeEventListener("resize")
        }
    })

    const resize_canvas = () => {
        canvas.width = innerWidth
        canvas.height = document.documentElement.scrollHeight
        dotsx = Math.floor(canvas.width / dotspace)
        dotsy = Math.floor(canvas.height / dotspace)
        offsetx = (canvas.width - (dotsx - 1) * dotspace) / 2
        offsety = (canvas.height - (dotsy - 1) * dotspace) / 2
    }

    const animate = () => {
        requestAnimationFrame(animate)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let x = 0; x < dotsx; x++) {
            const realx = offsetx + x * dotspace // precomputes realx per column instead of per row
            for (let y = 0; y < dotsy; y++) {
                const realy = offsety + y * dotspace
                ctx.beginPath()

                if ((realx - mx) ** 2 + (realy - my) ** 2 <= mradius ** 2) { // a^2 + b^2 = c^2, measures distance from cursor
                    ctx.drawImage(off_canvas["in"], realx, realy)
                } else {
                    ctx.drawImage(off_canvas["out"], realx, realy)
                }

                ctx.fill()
            }
        }
    }

    // returns a promise for a given color, promies resolves when it rasterizes a dot of that color
    const create_bitmap = (color) => new Promise((resolve) => {
        const off = document.createElement("canvas")
        off.width = dot_size
        off.height = dot_size
        const offctx = off.getContext("2d")

        const image = new Image()
        image.src = "/plus.svg"
        image.onload = () => {
            offctx.drawImage(image, 0, 0, dot_size, dot_size)

            offctx.globalCompositeOperation = "source-in"
            offctx.fillStyle = colors[color]
            offctx.fillRect(0, 0, off.width, off.height)

            off_canvas[color] = off
            resolve()
        }
    })
</script>

<canvas class="absolute top-0 left-0 z-0" bind:this={canvas}></canvas>