<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";

  export let inventory;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("./:id/view", { id: inventory.id })} class="dropdown-item"><i class="icon-eye" />Detail Inventaris</a>
      <a href={$url("./:id/update", { id: inventory.id })} class="dropdown-item"><i class="icon-trash-alt" />Update Inventaris</a>
      <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item"><i class="icon-pencil" />Hapus Inventaris</a>
    </svelte:fragment>
  </Dropdown>
</div>
