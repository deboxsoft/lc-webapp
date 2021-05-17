<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { loading, notify } = getApplicationContext();
  const { auth, approveGranted, rejectGranted, isUpdateOwnGranted, isRemoveOwnGranted } = getAclContext();
  const { approve, unApprove, reject, unReject } = getTransactionContext();

  export let transaction;

  $: approved = transaction.status === "APPROVED";
  $: rejected = transaction.status === "REJECTED";
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

  async function unApproveHandler() {
    $loading = true;
    if (await unApprove([id])) {
      transaction.status = "UNAPPROVED";
      notify(`transaksi id '${id}' telah diunapprove`, "success");
    } else {
      notify(`unapprove transaksi id '${id}' tidak berhasil`, "error");
    }
    $loading = false;
  }

  async function rejectHandler() {
    $loading = true;
    if (await reject([id])) {
      transaction.status = "REJECTED";
      notify(`transaksi id '${id}' telah diapprove`, "success");
    } else {
      notify(`approve transaksi id '${id}' tidak berhasil`, "error");
    }
    $loading = false;
  }

  async function unRejectHandler() {
    $loading = true;
    if (await unReject([id])) {
      transaction.status = "UNAPPROVED";
      notify(`transaksi id '${id}' telah diunreject`, "success");
    } else {
      notify(`unreject transaksi id '${id}' tidak berhasil`, "error");
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
      {#if approveGranted && !rejected}
        {#if !approved}
          <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={approveHandler}
            ><i class="icon-check2" />Approve</a
          >
        {:else}
          <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={unApproveHandler}
            ><i class="icon-undo2" />UnApprove</a
          >
        {/if}
      {/if}
      {#if rejectGranted && !approved}
        {#if !rejected}
          <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={rejectHandler}
            ><i class="icon-cancel-circle2" />Reject</a
          >
        {:else}
          <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={unRejectHandler}
            ><i class="icon-undo" />UnReject</a
          >
        {/if}
      {/if}
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="icon-eye" />Lihat Transaksi</a>
      {#if !approved}
        {#if isUpdateOwnGranted(transaction.userId)}
          <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Akun</a>
        {/if}
        {#if isRemoveOwnGranted(transaction.userId)}
          <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Transaksi</a>
        {/if}
      {/if}
    </div>
  </Dropdown>
</div>
