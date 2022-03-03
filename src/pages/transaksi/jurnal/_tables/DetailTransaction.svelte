<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { stores as usersStore } from "@deboxsoft/users-client";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { get } from "svelte/store";
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import { accountUtils } from "__@root/utils";
  import transaksi from "__@root/pages/transaksi/index.svelte";

  const { checkCashBalance } = accountUtils();
  const { loading, notify } = getApplicationContext();
  const { getTransactionType, approve, reject } = stores.getTransactionContext();
  const { getUser } = usersStore.getAuthenticationContext();

  export let backUrl;
  /**
   * @type{import("@deboxsoft/accounting-api").Transaction}
   */
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
    try {
      $loading = true;
      const result = await approve([transaction.id]);
      console.log(result);
      if (result) {
        transaction.status = "APPROVED";
        notify(`transaksi id '${transaction.id}' telah diapprove`, "success");
        closeHandler();
      } else {
        notify(`approve transaksi id '${transaction.id}' tidak berhasil`, "error");
      }
    } catch (e) {
      if (e?.code) {
        notify(e?.message || "approve gagal", "alert");
      } else {
        console.error(e);
      }
    } finally {
      $loading = false;
    }
  }

  async function rejectHandler() {
    $loading = true;
    if (await reject([transaction.id])) {
      transaction.status = "REJECTED";
      notify(`transaksi id '${transaction.id}' telah direject`, "success");
    } else {
      notify(`reject transaksi id '${transaction.id}' tidak berhasil`, "error");
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
      <dt class="col-sm-3 mb-0">No. Bukti/Kwitansi</dt>
      <p class="col-sm-9 mb-0">: {transaction.no || "-"}</p>
      <dt class="col-sm-3 mb-0">Tanggal Transaksi</dt>
      <p class="col-sm-7 d-inline-flex align-items-center mb-0">
        : <CellDate date={transaction.dateTransaction} />
      </p>
      <dt class="col-sm-3 mb-0">Tanggal Input</dt>
      <p class="col-sm-7 d-inline-flex align-items-center mb-0">
        : <CellDate date={transaction.dateInput || transaction.date} />
      </p>
      {#if transaction.status === "APPROVED" || transaction.status === "FIXED"}
        <dt class="col-sm-3 mb-0">Tanggal Approve</dt>
        <p class="col-sm-7 d-inline-flex align-items-center mb-0">
          : <CellDate date={transaction.date} />
        </p>
      {/if}
      <dt class="col-sm-3 mb-0">Deskripsi</dt>
      <p class="col-sm-9 mb-0">: {transaction.description || "-"}</p>
      <dt class="col-sm-3 mb-0">Jenis Transaksi</dt>
      <p class="col-sm-9 mb-0">: {(transactionType && transactionType.name) || "-"}</p>
      <dt class="col-sm-3 mb-0">Di Input Oleh</dt>
      <p class="col-sm-9 mb-0">: {(user && user.name) || "-"}</p>
      <dt class="col-sm-3 mb-0">Status</dt>
      <p class="col-sm-9 mb-0">
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
    <TransactionList {transaction} />
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
