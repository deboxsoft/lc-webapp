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
      <a href={$url("../statements/:id", { id })} class="dropdown-item"><i class="fal fa-file-excel" />Rekonsiliasi</a>
      <a href={$url("../home/:id/update", { id })} class="dropdown-item"><i class="fal fa-file-edit" />Ubah Bank</a>
      <a href={$url("../home/:id/remove", { id })} class="dropdown-item"><i class="fal fa-trash-alt" />Hapus Bank</a>
    </div>
  </Dropdown>
</div>
