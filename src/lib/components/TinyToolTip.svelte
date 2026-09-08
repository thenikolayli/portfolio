<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let { trigger, content, class: className = '' } = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger class={className}>
		{trigger}
	</Tooltip.Trigger>
	<Tooltip.Content>
		{content}
	</Tooltip.Content>
</Tooltip.Root>
