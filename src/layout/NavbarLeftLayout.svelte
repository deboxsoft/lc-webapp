<script lang="ts">
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import MenuIcon from "@deboxsoft/svelte-icons/MenuOutlined.svelte";
  import { getContext } from "__@root/store/ui";

  export let showToggleMenu: boolean = false;

  const { toggleMinimizeSidebar } = getContext();
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
        <Icon component={MenuIcon} />
      </a>
    </div>
  {/if}
</div>
