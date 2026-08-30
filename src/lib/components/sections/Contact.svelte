<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import FileText from '@lucide/svelte/icons/file-text';
	import GithubIcon from '$lib/components/decor/GithubIcon.svelte';
	import SectionHeader from '$lib/components/decor/SectionHeader.svelte';

	const links: { icon: any; label: string; value: string; href: string; target?: string }[] = [
		{
			icon: Mail,
			label: 'Email',
			value: 'nikolayliwork@gmail.com',
			href: 'mailto:nikolayliwork@gmail.com'
		},
		{ icon: Phone, label: 'Phone', value: '+1 (425) 215-5257', href: 'tel:+14252155257' },
		{
			icon: GithubIcon,
			label: 'GitHub',
			value: 'github.com/thenikolayli',
			href: 'https://github.com/thenikolayli',
			target: '_blank'
		},
		{
			icon: FileText,
			label: 'Resume',
			value: 'Download PDF',
			href: '/NikolayLiResume.pdf',
			target: '_blank'
		}
	];
</script>

<section id="contact" class="flex min-h-screen flex-col gap-6 py-20">
	<SectionHeader section="04 - contact" title="Get in touch" subtitle="with me" />

	<ul class="space-y-3">
		{#each links as link (link.label)}
			<li>
				<a
					href={link.href}
					target={link.target}
					class="flex items-center gap-4 rounded-lg border-2 bg-card p-4 shadow-sm transition-colors duration-200 hover:border-primary"
				>
					<span
						class="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
					>
						<link.icon class="size-6" />
					</span>
					<span class="min-w-0">
						<span class="mono-label block text-muted-foreground">{link.label}</span>
						<span class="block truncate text-sm font-medium text-foreground">{link.value}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<p class="mt-auto flex flex-col text-center font-sans text-xs text-muted-foreground">
		a Nikolay Li production<br />Portfolio © 2026
	</p>
</section>
