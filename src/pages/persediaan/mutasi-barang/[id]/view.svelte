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
  const { stockDetail, productContext } = stores.getStockContext();
  const { findById } = productContext;
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
  let product,
    productName = "...loading";
  stockDetail($params.id).then(async (_) => {
    stock = _;
    openDialog();
    if (stock) {
      product = await findById(stock.productId);
      productName = product?.name || "-";
    }
  });

  function closeHandler() {
    $goto(closeUrl, {});
  }
</script>

<Modal class="modal-lg" title="Detail Stock" bind:openDialog onClose={closeHandler}>
  <dl class="row">
    <dt class="col-sm-3 mb-0">Nama Barang</dt>
    <p class="col-sm-9 mb-0">: {product?.name || "-"}</p>
    <dt class="col-sm-3 mb-0">Tanggal</dt>
    <p class="col-sm-9 mb-0">: <CellDate date={stock.date} format="DD-MMMM-YYYY" /></p>
    <dt class="col-sm-3 mb-0">Mutasi</dt>
    <p class="col-sm-9 mb-0">: {stock?.mutation === "STOCK_IN" ? "masuk" : "keluar"}</p>
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
  </svelte:fragment>
</Modal>
