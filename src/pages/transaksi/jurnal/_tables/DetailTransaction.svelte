<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { stores as usersStore } from "@deboxsoft/users-client";
  import Modal from "__@comps/Modal.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { get } from "svelte/store";

  const { loading, notify } = getApplicationContext();
  const { getTransactionType, approve, reject } = stores.getTransactionContext();
  const { getUser } = usersStore.getAuthenticationContext();

  export let backUrl;
  export let transaction;
  export let rejectButtonEnable = false;
  export let approveButtonEnable = false;
  /**
   * @type {"loading" | "finish"}
   */
  let state = "loading";

  let openDialog, user, transactionType;

  $: {
    if (transaction) {
      transactionType = get(getTransactionType(transaction.type));
      init();
    }
  }

  async function init() {
    try {
      user = await getUser(transaction.userId);
    } catch (e) {
    } finally {
      state = "finish";
    }
  }

  onMount(() => {
    openDialog();
  });

  async function approveHandler() {
    $loading = true;
    if (await approve([transaction.id])) {
      transaction.status = "APPROVED";
      notify(`transaksi id '${transaction.id}' telah diapprove`, "success");
    } else {
      notify(`approve transaksi id '${transaction.id}' tidak berhasil`, "error");
    }
    $loading = false;
    closeHandler();
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
    closeHandler();
  }
  function closeHandler() {
    $goto(backUrl, {});
  }
</script>

<Modal
  title={($params.id && `Detail Transaksi '${$params.id}'`) || ""}
  class="modal-lg"
  bind:openDialog
  onClose={closeHandler}
>
  {#if transaction && state === "finish"}
    <dl class="row">
      <dt class="col-sm-3">No. Bukti/Kwitansi</dt>
      <p class="col-sm-9">: {transaction.no || "-"}</p>
      <dt class="col-sm-3">Tanggal</dt>
      <p class="col-sm-9">: {dayjs(transaction.date).format("DD-MMMM-YYYY") || "-"}</p>
      <dt class="col-sm-3">Tanggal Transaksi</dt>
      <p class="col-sm-9">: {dayjs(transaction.dateTransaction || transaction.date).format("DD-MMMM-YYYY") || "-"}</p>
      <dt class="col-sm-3">Deskripsi</dt>
      <p class="col-sm-9">: {transaction.description || "-"}</p>
      <dt class="col-sm-3">Jenis Transaksi</dt>
      <p class="col-sm-9">: {(transactionType && transactionType.name) || "-"}</p>
      <dt class="col-sm-3">Di Input Oleh</dt>
      <p class="col-sm-9">: {(user && user.name) || "-"}</p>
      <dt class="col-sm-3">Status</dt>
      <p class="col-sm-9">
        :
        <span
          class="badge"
          class:badge-primary={transaction.status === "UNAPPROVED"}
          class:badge-danger={transaction.status === "REJECTED"}
          class:badge-light={transaction.status === "FIXED"}
          class:badge-success={transaction.status === "APPROVED"}>{transaction.status}</span
        >
      </p>
    </dl>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 100px">Kode</th>
          <th>Akun Perkiraan</th>
          <th style="width: 150px">Jumlah Debit</th>
          <th style="width: 150px">Jumlah Kredit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{transaction.accountId || "-"}</td>
          <td><CellAccount id={transaction.accountId} /></td>
          <td><CellRp value={transaction.amount} /></td>
          <td class="text-right">-</td>
        </tr>
        {#each transaction.creditAccounts as accountAmount, index (accountAmount.index)}
          <tr>
            <td>{accountAmount.id || "-"}</td>
            <td><CellAccount id={accountAmount.id} /></td>
            <td class="text-right">-</td>
            <td><CellRp value={accountAmount.amount} /></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <Loader />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}> Reject </button>
    {/if}
    {#if approveButtonEnable}
      <button type="button" class="btn btn-primary" on:click={approveHandler}> Approve </button>
    {/if}
  </svelte:fragment>
</Modal>
