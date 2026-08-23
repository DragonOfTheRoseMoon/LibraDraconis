<script lang="ts">
    import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
    import { MenuIcon, House, Search as SearchIcon, Library as LibraryIcon, Heart } from '@lucide/svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

const iconMap = {
    '/': House,
    '/search': SearchIcon,
    '/library': LibraryIcon,
    '/wishlist': Heart
};

let CurrentIcon = $derived(iconMap[page.route.id as keyof typeof iconMap] ?? House);

let navbarText = $derived.by(() => {
    if (!page.route.id || page.route.id === '/') return 'LibraDraconis';
    const name = page.route.id.replace(/^\//, '');
    return name.charAt(0).toUpperCase() + name.slice(1);
});
</script>


<AppBar class="w-full sticky top-0 z-50 navbar-appbar after:content-[''] after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-linear-to-b after:from-surface-100-900 after:to-transparent after:pointer-events-none">
    <AppBar.Toolbar class="grid grid-cols-2">

    <AppBar.Lead class="flex items-center gap-3 px-3">
        <CurrentIcon class="w-9 h-9 text-primary-500" />
        <p class="text-4xl">{navbarText}</p>
    </AppBar.Lead>
        <AppBar.Trail class="flex justify-end items-center gap-3 px-3">
            <Menu onSelect={(details) => goto(details.value)}>
                <Menu.Trigger class="btn-icon size-10 preset-outlined-primary-500 hover:preset-filled-primary-500 transition duration-300">
                    <MenuIcon size={20} />
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner class="navbar-menu-positioner">
                        <Menu.Content class="p-3 lg:p-4 rounded-lg bg-surface-50-950">
                            <Menu.Item value="/" class="flex items-center gap-2">
                                <House size={16} />
                                <Menu.ItemText class="hover:underline hover:text-primary-500 lg:text-lg">Home</Menu.ItemText>
                            </Menu.Item>
                            <Menu.Item value="/search" class="flex items-center gap-2">
                                <SearchIcon size={16} />
                                <Menu.ItemText class="hover:underline hover:text-primary-500 lg:text-lg">Search</Menu.ItemText>
                            </Menu.Item>
                            <Menu.Item value="/library" class="flex items-center gap-2">
                                <LibraryIcon size={16} />
                                <Menu.ItemText class="hover:underline hover:text-primary-500 lg:text-lg">Library</Menu.ItemText>
                            </Menu.Item>
                            <Menu.Item value="/wishlist" class="flex items-center gap-2">
                                <Heart size={16} />
                                <Menu.ItemText class="hover:underline hover:text-primary-500 lg:text-lg">Wishlist</Menu.ItemText>
                            </Menu.Item>
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