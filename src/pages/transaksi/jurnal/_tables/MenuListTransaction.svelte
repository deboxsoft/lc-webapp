<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../../components/DropdownToggle.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import { accountUtils } from "../../../../utils";

  const appContext = getApplicationContext();
  const { loading, notify } = appContext;
  const { getBalanceFix } = stores.createBalanceContext(appContext);
  const { getAccount } = stores.getAccountContext();
  const { auth, approveGranted, rejectGranted, removeGranted, updateGranted } = getAclContext();
  const { approve, unApprove, reject, unReject } = stores.getTransactionContext();
  const { checkCashBalance } = accountUtils();

  export let transaction;

  $: approved = transaction.status === "APPROVED";
  $: rejected = transaction.status === "REJECTED";
  $: fixed = transaction.status === "FIXED";
  let dropdownTriggerElement;

  $: id = transaction.id;

  async function approveHandler() {
    try {

      $loading = true;
      const creditAccounts = transaction.creditAccounts;
      for (const creditAccount of creditAccounts) {
        await checkCashBalance(creditAccount.id, creditAccount.amount);
      }
        if (await approve([id])) {
          transaction.status = "APPROVED";
          notify(`transaksi id '${id}' telah diapprove`, "success");
        } else {
          throw new Error(`approve transaksi id '${id}' tidak berhasil`);
        }
        $loading = false;
    } catch (e) {
      notify(e.message, "error");
    }
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
      notify(`transaksi id '${id}' telah direject`, "success");
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
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu" let:closeHandler>
      {#if approveGranted && !rejected && !fixed}
        {#if !approved}
          <a
            href="/#"
            class="dropdown-item"
            target="_self"
            on:click|preventDefault={approveHandler}
            on:mouseup={closeHandler}><i class="icon-check2" />Approve</a
          >
          <!--{:else}-->
          <!--  <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={unApproveHandler}-->
          <!--    ><i class="icon-undo2" />UnApprove</a-->
          <!--  >-->
        {/if}
      {/if}
      <!--{#if rejectGranted && !approved && !fixed}-->
      <!--  {#if !rejected}-->
      <!--    <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={rejectHandler}-->
      <!--      ><i class="icon-cancel-circle2" />Reject</a-->
      <!--    >-->
      <!--  {:else}-->
      <!--    <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={unRejectHandler}-->
      <!--      ><i class="icon-undo" />UnReject</a-->
      <!--    >-->
      <!--  {/if}-->
      <!--{/if}-->
      <a href={$url("./:id/view", { id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-eye" />Lihat Transaksi</a
      >
      {#if !approved && !fixed}
        {#if updateGranted(transaction.userId)}
          <a href={$url("./:id/update", { id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-pencil" />Edit Transaksi</a
          >
        {/if}
        {#if removeGranted(transaction.userId)}
          <a href={$url("./:id/remove", { id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-trash-alt" />Hapus Transaksi</a
          >
        {/if}
      {/if}
    </svelte:fragment>
  </Dropdown>
</div>
