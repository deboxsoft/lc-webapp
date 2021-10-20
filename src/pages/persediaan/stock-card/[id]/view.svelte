<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { goto, params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";

  const { stockDetail } = stores.getStockContext();

  /**
   * @type{import("@deboxsoft/accounting-api").StockDetail}
   */
  let stock;
  let transaction;
  const closeUrl = $params.closeUrl || "../";
  let openDialog;
  stockDetail($params.id).then(_ => {
    stock = _;
    transaction = _.transaction;
    openDialog();
  });

  function closeHandler() {
    $goto(closeUrl, {});
  }
</script>

<Modal class="modal-lg" title="Detail Stock" bind:openDialog onClose={closeHandler}>
    <dl class="row">
      <dt class="col-sm-3 mb-0">Nama Barang</dt>
      <p class="col-sm-9 mb-0">: {stock?.name || "-"}</p>
      <dt class="col-sm-3 mb-0">Tanggal</dt>
      <p class="col-sm-9 mb-0">: <CellDate date={transaction.date} format="DD-MMMM-YYYY" /></p>
      <dt class="col-sm-3 mb-0">Tanggal Transaksi</dt>
      <p class="col-sm-9 mb-0">: <CellDate date={transaction?.dateTransaction} format="DD-MMMM-YYYY" /></p>
      <dt class="col-sm-3 mb-0">No Transaksi</dt>
      <p class="col-sm-9 mb-0">: {transaction?.id || "-"}</p>
      <dt class="col-sm-3 mb-0">Status Transaksi</dt>
      <p class="col-sm-9 mb-0">:
        <TransactionStatus status={transaction?.status} />
      </p>
      <dt class="col-sm-3 mb-0">Jumlah</dt>
      <p class="col-sm-9 mb-0">: {stock.quantity} {stock.unit || ""}</p>
      <dt class="col-sm-3 mb-0">Harga Satuan</dt>
      <p class="col-sm-9 mb-0">
        <CellNumber value={stock.price} class="w-25" prefix=":" prefixClass="mr-1" />
      </p>
      <dt class="col-sm-3 mb-0">Deskripsi</dt>
      <p class="col-sm-9 mb-0">: {stock?.description || ""}</p>
    </dl>
    <TransactionList {transaction}  />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
