<script>
  import DropdownToggle from "../components/DropdownToggle.svelte";
  import Dropdown from "../components/Dropdown.svelte";
  export let count;
</script>

<Dropdown nav direction="end">
  <DropdownToggle class="d-flex align-items-center navbar-nav-link" tag="div">
    <i class="icon-clipboard6" style="font-size: 1.25rem" />
    {#if count && count !== 0}
      <span class="badge badge-danger badge-pill">{count}</span>
    {/if}
  </DropdownToggle>
  <svelte:fragment slot="menu">
    <a href="dropdown" />
  </svelte:fragment>
</Dropdown>
<style lang="scss" global>
  .dbx-theme {
    .navbar-nav-link .badge {
      top: 5px;
    }
  }
</style>