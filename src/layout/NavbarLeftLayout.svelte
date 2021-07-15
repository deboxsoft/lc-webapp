<script>
  import MenuIcon from "__@comps/icons/Bars.svelte";
  import { getUIContext } from "__@root/stores/ui";

  export let showToggleMenu = false;

  const { toggleMinimizeSidebar } = getUIContext();
</script>

<div class="navbar-nav">
  <!-- toggle Menu -->
  {#if showToggleMenu}
    <div class="nav-item">
      <a
        href="/#"
        on:click|preventDefault={toggleMinimizeSidebar}
        class="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block"
        target="_self">
        <MenuIcon />
      </a>
    </div>
  {/if}
</div>
