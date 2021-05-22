<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";

  export let inventory;
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
      <a href={$url("./:id/view", { id: inventory.id })} class="dropdown-item"><i class="icon-eye" />Detail Inventaris</a>
      <a href={$url("./:id/update", { id: inventory.id })} class="dropdown-item"><i class="icon-trash-alt" />Update Inventaris</a>
      <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item"><i class="icon-pencil" />Hapus Inventaris</a>
    </div>
  </Dropdown>
</div>
