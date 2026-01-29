<script>
    let {src, title, description, link, github_link, tools_used} = $props()
    import Icon from "@iconify/svelte"
</script>

<section class="w-full h-[500px] aspect-[1.5] bg-gradient-to-b from-bg to-bg-dark from-10% p-2 border-2 border-bg-dark border-t-highlight shadow">

    <div class="w-full h-[80%]">
        <img src={src} alt="Screenshot" class="w-full max-h-[30%] object-contain">
        <h1 class="text-3xl mt-4">{title}</h1>
        <p class="text-lg font-light text-text-muted">{description}</p>
    </div>

    <div class="w-full h-[20%] flex justify-between">
        <div class="flex h-full text-2xl items-end gap-2">
            <a href={link} target="_blank" aria-label="Link to project"><Icon icon="fe:link-external"/></a>
            <a href={github_link} target="_blank" aria-label="Link to project repository"><Icon icon="fa7-brands:github"/></a>
        </div>

        <div class="flex flex-wrap w-3/4 h-full gap-2 justify-end items-end">
            {#each Object.entries(tools_used) as [key, value]}
                <img class="h-[32px] w-[32px] object-contain" src={value} alt={key}>
            {/each}
        </div>
    </div>

</section>