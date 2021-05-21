<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";

  export let id;
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
      <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Statement</a>
    </div>
  </Dropdown>
</div>
