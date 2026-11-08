<script lang="ts">
	import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import {
		MenuIcon,
		House,
		Search as SearchIcon,
		Library as LibraryIcon,
		ChartNoAxesCombined as Chart,
		Heart
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const navItems = [
		{ path: '/', label: 'Home', icon: House },
		{ path: '/search', label: 'Search', icon: SearchIcon },
		{ path: '/library', label: 'Library', icon: LibraryIcon },
		{ path: '/stats', label: 'Statistics', icon: Chart },
		{ path: '/wishlist', label: 'Wishlist', icon: Heart }
	] as const;

	let CurrentIcon = $derived(navItems.find((item) => item.path === page.route.id)?.icon ?? House);

	function handleSelect(details: { value: string }) {
		const item = navItems.find((navItem) => navItem.path === details.value);
		if (item) goto(resolve(item.path));
	}

	let navbarText = $derived.by(() => {
		if (!page.route.id || page.route.id === '/') return 'LibraDraconis';
		const firstSegment = page.route.id.replace(/^\//, '').split('/')[0];
		return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
	});
</script>

<AppBar
	class="navbar-appbar sticky top-0 z-50 w-full after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-linear-to-b after:from-surface-100-900 after:to-transparent after:content-['']"
>
	<AppBar.Toolbar class="grid grid-cols-2">
		<AppBar.Lead class="flex items-center gap-3 px-3">
			<CurrentIcon class="h-9 w-9 text-primary-500" />
			<p class="text-4xl">{navbarText}</p>
		</AppBar.Lead>
		<AppBar.Trail class="flex items-center justify-end gap-3 px-3">
			<Menu onSelect={handleSelect}>
				<Menu.Trigger
					class="btn-icon size-10 preset-outlined-primary-500 transition duration-300 hover:preset-filled-primary-500"
				>
					<MenuIcon size={20} />
				</Menu.Trigger>
				<Portal>
					<Menu.Positioner class="navbar-menu-positioner">
						<Menu.Content class="rounded-lg bg-surface-50-950 p-3 lg:p-4">
							{#each navItems as item (item.path)}
								<Menu.Item value={item.path} class="flex items-center gap-2">
									<item.icon size={16} />
									<Menu.ItemText class="hover:text-primary-500 hover:underline lg:text-lg"
										>{item.label}</Menu.ItemText
									>
								</Menu.Item>
							{/each}
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>

<style>
	:global(.navbar-menu-positioner) {
		--z-index: 100 !important;
	}

	:global(.navbar-appbar) {
		padding-top: 0.5rem !important;
		padding-bottom: 0.5rem !important;
	}
</style>
