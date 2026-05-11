<script lang="ts">
    let { label }: { label: string } = $props();
</script>

<div class="flex flex-col">
    <span class="text-primary font-mono">// {label}</span>
    <span class="text-4xl text-muted-foreground font-barcode">// {label}</span>
</div>