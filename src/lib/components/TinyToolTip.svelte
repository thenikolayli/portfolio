<script lang="ts">
    import * as Tooltip from '$lib/components/ui/tooltip/index.js';

    let {trigger, content} = $props();
</script>

<Tooltip.Root>
    <Tooltip.Trigger>
        {trigger}
    </Tooltip.Trigger>
    <Tooltip.Content>
        {content}
    </Tooltip.Content>
</Tooltip.Root>
