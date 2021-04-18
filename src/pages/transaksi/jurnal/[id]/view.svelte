<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import { getTransactionContext, getAccountContext, getTransactionService } from "__@modules/accounting";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import { writable } from "svelte/store";

  const context = getTransactionContext();
  const { getAccount } = getAccountContext();

  export let backUrl = $params.backUrl || "../";

  let transaction = writable(undefined);
  let isMounted = false;
  $: {
    if ($params.id) {
      transaction = context && context.getTransaction($params.id);
      // if (!$transaction && !isMounted) {
      //   isMounted = true;
      //   getTransactionService()
      //     .findById($params.id)
      //     .then((_) => {
      //       transaction = writable({
      //         ..._,
      //         date: format(parse(_.date, "T", new Date()), "dd MMMM yyyy") || ""
      //       });
      //     });
      // }
    }
  }

  function closeHandler() {
    $goto(backUrl, {});
  }
</script>

<Modal title={($params.id && `Detail Transaksi '${$params.id}'`) || ""} class="modal-lg">
  {#if $transaction}
    <div class="row">
      <div class="col-sm-3">No. Bukti/Kwitansi</div>
      <div class="col-sm-9">: {$transaction.no || "-"}</div>
    </div>
    <div class="row">
      <div class="col-sm-3">Tanggal</div>
      <div class="col-sm-9">: {$transaction.date || "-"}</div>
    </div>
    <div class="row">
      <div class="col-sm-3">Deskripsi</div>
      <div class="col-sm-9">: {$transaction.description || "-"}</div>
    </div>
    <div class="row">
      <div class="col-sm-3">Status</div>
      <div class="col-sm-9">
        :
        <span
          class="badge"
          class:badge-warning={$transaction.status === "UNAPPROVED"}
          class:badge-success={$transaction.status === "APPROVED"}>{$transaction.status || ""}</span
        >
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 100px">Kode Akun</th>
          <th>Nama Akun</th>
          <th style="width: 150px">Jumlah Debit</th>
          <th style="width: 150px">Jumlah Kredit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{$transaction.accountId || "-"}</td>
          <td><CellAccount id={$transaction.accountId} /></td>
          <td><CellRp value={$transaction.amount} /></td>
          <td class="text-right">-</td>
        </tr>
        {#each $transaction.accounts as journalAccount, index (journalAccount.index)}
          <tr>
            <td>{journalAccount.accountId || "-"}</td>
            <td><CellAccount id={journalAccount.accountId} /></td>
            <td class="text-right">-</td>
            <td><CellRp value={journalAccount.amount} /></td>
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
  </svelte:fragment>
</Modal>
