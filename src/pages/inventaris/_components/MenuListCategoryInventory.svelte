<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";

  export let categoryInventory;
</script>

<div class="list-icons">
  <Dropdown let:toggle let:toggleClass>
    <a
      href="/#"
      on:click|preventDefault={toggle}
      class="list-icons-item align-items-center {toggleClass}"
      target="_self"
    >
      <i class="icon-menu9" />
    </a>
    <div slot="menu">
      <a href={$url("./:category/view", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-eye" />Detail Kategori Inventaris</a>
      <a href={$url("./:category/update", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-trash-alt" />Update Kategori Inventaris</a>
      <a href={$url("./:category/remove", { category: categoryInventory.id })} class="dropdown-item"><i class="icon-pencil" />Hapus Kategori Inventaris</a>
    </div>
  </Dropdown>
</div>
