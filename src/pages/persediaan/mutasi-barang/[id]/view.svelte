<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { goto, params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { loading, notify } = getApplicationContext();
  const { approve, reject } = stores.getStockContext();
  const { stockDetail } = stores.getStockContext();
  const { createGranted } = getAclContext();

  const rejectButtonEnable = createGranted;
  const approveButtonEnable = createGranted;

  /**
   * @type{import("@deboxsoft/accounting-api").StockDetail}
   */
  let stock;
  let transaction;
  const closeUrl = $params.closeUrl || "../";
  let openDialog;
  stockDetail($params.id).then((_) => {
    stock = _;
    openDialog();
  });

  async function approveHandler() {
    $loading = true;
    if (await approve(stock.id)) {
      notify(`approve stok id '${stock.id}' berhasil diapprove`, "success");
    } else {
      notify(`approve stok id '${stock.id}' tidak berhasil diapprove`, "error");
    }
    $loading = false;
    closeHandler();
  }

  async function rejectHandler() {
    $loading = true;
    if (await reject(stock.id)) {
      notify(`reject stok id '${stock.id}' berhasil direject`, "success");
    } else {
      notify(`reject stok id '${stock.id}' tidak berhasil`, "error");
    }
    $loading = false;
    closeHandler();
  }

  function closeHandler() {
    $goto(closeUrl, {});
  }
</script>

<Modal class="modal-lg" title="Detail Stock" bind:openDialog onClose={closeHandler}>
  <dl class="row">
    <dt class="col-sm-3 mb-0">Nama Barang</dt>
    <p class="col-sm-9 mb-0">: {stock?.name || "-"}</p>
    <dt class="col-sm-3 mb-0">Tanggal</dt>
    <p class="col-sm-9 mb-0">: <CellDate date={stock.date} format="DD-MMMM-YYYY" /></p>
    <dt class="col-sm-3 mb-0">Mutasi</dt>
    <p class="col-sm-9 mb-0">: {stock?.mutation === "STOCK_IN" ? "masuk" : "keluar"}</p>
    {#if transaction}
      <dt class="col-sm-3 mb-0">Tanggal Transaksi</dt>
      <p class="col-sm-9 mb-0">: <CellDate date={transaction?.dateTransaction} format="DD-MMMM-YYYY" /></p>
      <dt class="col-sm-3 mb-0">No Transaksi</dt>
      <p class="col-sm-9 mb-0">: {transaction?.id || "-"}</p>
    {/if}
    <dt class="col-sm-3 mb-0">Status</dt>
    <p class="col-sm-9 mb-0">
      :
      <TransactionStatus status={stock?.status || "-"} />
    </p>
    <dt class="col-sm-3 mb-0">Jumlah</dt>
    <p class="col-sm-9 mb-0">: {stock.quantity} {stock.unit || ""}</p>
    <dt class="col-sm-3 mb-0">Harga Satuan</dt>
    <p class="col-sm-9 mb-0">
      <CellNumber value={stock.price} class="w-25" prefix=":" prefixClass="mr-1" />
    </p>
    <dt class="col-sm-3 mb-0">Total</dt>
    <p class="col-sm-9 mb-0">
      <CellNumber value={stock.price * stock.quantity} class="w-25" prefix=":" prefixClass="mr-1" />
    </p>
  </dl>
  {#if transaction}
    <TransactionList {transaction} />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable && stock?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}> Reject </button>
    {/if}
    {#if approveButtonEnable && stock?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-primary" on:click={approveHandler}> Approve </button>
    {/if}
  </svelte:fragment>
</Modal>
