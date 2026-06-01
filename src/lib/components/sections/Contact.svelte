<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import FileText from '@lucide/svelte/icons/file-text';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';
	// import Github from '$lib/components/icons/GithubIcon.svelte';

	const links = [
		{ icon: Mail, label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
		{ icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', href: 'tel:+15550000000' },
		// {
		// 	icon: Github,
		// 	label: 'GitHub',
		// 	value: 'github.com/username',
		// 	href: 'https://github.com/username'
		// },
		{ icon: FileText, label: 'Résumé', value: 'Download PDF', href: '/resume.pdf' }
	];
</script>

<section id="contact" class="flex min-h-screen flex-col justify-center gap-6 py-20">
	<SectionHeader section="04 - contact" title="Get in touch" subtitle="with me" />

	<ul class="space-y-3">
		{#each links as link (link.label)}
			{@const Icon = link.icon}
			<li>
				<a
					href={link.href}
					class="group flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-primary"
				>
					<span
						class="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
					>
						<Icon class="size-5" />
					</span>
					<span class="min-w-0">
						<span class="mono-label block text-muted-foreground">{link.label}</span>
						<span class="block truncate text-sm font-medium text-foreground">{link.value}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<p
		class="absolute inset-x-0 bottom-4 mx-auto flex flex-col text-center font-sans text-xs text-muted-foreground"
	>
		a Nikolay Li production<br />Portfolio © 2026
	</p>
</section>
