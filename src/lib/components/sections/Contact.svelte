<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import FileText from '@lucide/svelte/icons/file-text';
	import Github from '$lib/components/icons/GithubIcon.svelte';

	const links = [
		{ icon: Mail, label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
		{ icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', href: 'tel:+15550000000' },
		{ icon: Github, label: 'GitHub', value: 'github.com/username', href: 'https://github.com/username' },
		{ icon: FileText, label: 'Résumé', value: 'Download PDF', href: '/resume.pdf' }
	];
</script>

<section id="contact" class="py-16">
	<div class="space-y-3">
		<span class="mono-label text-primary">// 04 — contact</span>
	</div>

	<h2 class="text-foreground mt-6 mb-8 text-2xl font-bold tracking-tight">Get in touch</h2>

	<ul class="space-y-3">
		{#each links as link (link.label)}
			{@const Icon = link.icon}
			<li>
				<a
					href={link.href}
					class="bg-card hover:border-primary group flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-colors"
				>
					<span
						class="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-md"
					>
						<Icon class="size-5" />
					</span>
					<span class="min-w-0">
						<span class="mono-label text-muted-foreground block">{link.label}</span>
						<span class="text-foreground block truncate text-sm font-medium">{link.value}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<p class="text-muted-foreground mt-10 text-center text-xs">
		<span class="mono-label">© 2026 — placeholder footer</span>
	</p>
</section>
