<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";

  export let categoryInventory;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("./:category/view", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-eye" />Detail Kategori Inventaris</a>
      <a href={$url("./:category/update", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-trash-alt" />Update Kategori Inventaris</a>
      <a href={$url("./:category/remove", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-pencil" />Hapus Kategori Inventaris</a>
    </svelte:fragment>
  </Dropdown>
</div>
