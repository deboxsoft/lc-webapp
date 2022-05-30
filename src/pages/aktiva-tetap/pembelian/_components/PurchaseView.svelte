<script>
  import { getApplicationContext } from "__@modules/app";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { writable } from "svelte/store";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import TransactionItems from "__@root/pages/aktiva-tetap/pembelian/_components/TransactionItems.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { loading, notify } = getApplicationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();

  /**
   * @type{import("@deboxsoft/accounting-api").InventoryTransaction}
   */
  export let inventoryTransaction;
  export let userPromise;
  let userName = writable("....load");

  userPromise.then((_) => {
    $userName = _.name;
  });

  function calculate() {
    const total = inventoryTransaction.items.reduce((_, item) => {
      return _ + item.quantity * item.priceItem;
    }, 0);
    return {
      total,
      payableAmount: total - inventoryTransaction.cashAmount
    };
  }

  const calc = calculate();
</script>

<dl class="row">
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
  <dt class="col-sm-3 mb-0">Di Input Oleh</dt>
  <p class="col-sm-9 mb-0">: {$userName || "-"}</p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<TransactionStatus status={inventoryTransaction.status} />
  </p>
  <dt class="col-sm-3 mb-0">Akun di Debet</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<CellAccount id={inventoryTransaction.inventoryAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Akun Pembayaran</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<CellAccount id={inventoryTransaction.cashAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Jumlah Pembayaran</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px"><CellNumber value={inventoryTransaction.cashAmount} /></div>
  </div>
  <dt class="col-sm-3 mb-0">Akun Hutang</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<CellAccount id={$preferenceStore.inventory.payableAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Jumlah Hutang</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px"><CellNumber value={calc.payableAmount} /></div>
  </div>
  <dt class="col-sm-3 mb-0">Total Keseluruhan</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px"><CellNumber value={calc.total} /></div>
  </div>
</dl>
<TransactionItems {inventoryTransaction} />
