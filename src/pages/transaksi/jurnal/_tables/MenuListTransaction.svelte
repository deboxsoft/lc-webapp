<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";

  export let transaction;

  let readonly = transaction.status === "APPROVED";
  let id = transaction.id;
  let dropdownTriggerElement;

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
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="fal fa-file-search" />Lihat Transaksi</a>
      {#if !readonly}
        <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="fal fa-file-edit" />Ubah Akun</a>
        <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="fal fa-trash-alt" />Hapus Transaksi</a>
      {/if}
    </div>
  </Dropdown>
</div>
