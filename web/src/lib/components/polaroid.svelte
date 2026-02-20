<script>
	let { photoUrl, captionUrl } = $props();
</script>

<section
	class="flex h-88 w-62 flex-col overflow-hidden bg-white p-4 shadow-lg outline-1 outline-black/20"
>
	<img src={photoUrl} alt="" class="aspect-square w-full object-contain" />
	<img src={captionUrl} alt="" class="min-h-0 w-full flex-1 object-fill" />
</section>
