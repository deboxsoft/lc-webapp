<script>
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import { writable } from "svelte/store";
  import ContractNotification from "../pages/bdd/_menus/ContractNotification.svelte";

  let count = writable(0), countContractBDD = writable(0);

  $: $count = $countContractBDD
</script>

<Dropdown nav direction="end">
  <DropdownToggle class="d-flex align-items-center navbar-nav-link" tag="div">
    <i class="icon-bell2" style="font-size: 1.25rem" />
    {#if $count !== 0}
      <span class="badge badge-danger badge-pill">{$count}</span>
    {/if}
  </DropdownToggle>
  <svelte:fragment slot="menu">
    <ContractNotification bind:count={countContractBDD} class="dropdown-item" />
  </svelte:fragment>
</Dropdown>
<style lang="scss" global>
  .dbx-theme {
    .navbar-nav-link .badge {
      top: 5px;
    }
  }
</style>