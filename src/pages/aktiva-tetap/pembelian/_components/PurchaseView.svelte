<script>
  import { getApplicationContext } from "__@modules/app";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { writable } from "svelte/store";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import TransactionItems from "__@root/pages/aktiva-tetap/pembelian/_components/TransactionItems.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import AccountAmountTable from "__@comps/transactions/AccountAmountTable.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  const { loading, notify } = getApplicationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();

  /**
   * @type{import("@deboxsoft/accounting-api").InventoryTransaction}
   */
  export let inventoryTransaction;
  export let createBy = "...load";
  export let approveBy = "...load";
  export let userPromise;
  const _createBy = writable(),
    _approveBy = writable();
  $: $_createBy = createBy;
  $: $_approveBy = approveBy;
  const total = inventoryTransaction.paymentAccounts.reduce((tot, item) => tot + item.amount, 0);
</script>

<dl class="row mb-0">
  <dt class="col-sm-3 mb-0">No. Nota</dt>
  <p class="col-sm-9 mb-0">
    : {inventoryTransaction.no || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Tanggal Pembelian</dt>
  <p class="col-sm-9 mb-0">
    : <CellDate date={inventoryTransaction.datePurchase} />
  </p>
  <dt class="col-sm-3 mb-0">Tanggal</dt>
  <p class="col-sm-9 mb-0">
    : <CellDate date={inventoryTransaction.date} />
  </p>
  <dt class="col-sm-3 mb-0">Deskripsi</dt>
  <p class="col-sm-9 mb-0">: {inventoryTransaction.description || "-"}</p>
  <dt class="col-sm-3 mb-0">Akun Inventaris</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<CellAccount id={inventoryTransaction.inventoryAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Total</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px"><CellNumber value={total} /></div>
  </div>
  <dt class="col-sm-3 mb-0">Di Input Oleh</dt>
  <p class="col-sm-9 mb-0">: {$_createBy || "-"}</p>
  <dt class="col-sm-3 mb-0">Di Approve Oleh</dt>
  <p class="col-sm-9 mb-0">: {$_approveBy || "-"}</p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<TransactionStatus status={inventoryTransaction.status} />
  </p>
</dl>
<dl class="row mb-0">
  <dt class="col-sm-3 mb-0">Pembayaran</dt>
  <p class="col-sm-9 mb-0">:</p>
</dl>
<AccountAmountTable dataList={inventoryTransaction.paymentAccounts} />
<dl class="row mb-0 mt-2">
  <dt class="col-sm-3 mb-0">Daftar Barang</dt>
  <p class="col-sm-9 mb-0">:</p>
</dl>
<TransactionItems {inventoryTransaction} />
