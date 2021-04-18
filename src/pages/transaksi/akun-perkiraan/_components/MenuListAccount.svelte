<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { remove, update } = getAccountContext();
  export let id;
  export let removeActDisable = false;
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
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="fal fa-file-alt" />Lihat Akun</a>
      <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="fal fa-file-edit" />Ubah Akun</a>
      {#if !removeActDisable}
        <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="fal fa-trash-alt" />Hapus Akun</a>
      {/if}
    </div>
  </Dropdown>
</div>
