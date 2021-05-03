<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";

  const { loading, notify } = getApplicationContext();
  const { approve } = getTransactionContext();
  export let transaction;

  let readonly = transaction.status === "APPROVED";
  let dropdownTriggerElement;

  $: id = transaction.id;

  async function approveHandler() {
    $loading = true;
    if (await approve([id])) {
      transaction.status = "APPROVED";
      notify(`transaksi id '${id}' telah diapprove`, "success");
    } else {
      notify(`approve transaksi id '${id}' tidak berhasil`, "error");
    }
    $loading = false;
  }
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
      {#if !readonly}
        <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={approveHandler}
          ><i class="icon-check2" />Approve</a
        >
      {/if}
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="icon-eye" />Lihat Transaksi</a>
      {#if !readonly}
        <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Akun</a>
        <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Transaksi</a>
      {/if}
    </div>
  </Dropdown>
</div>
