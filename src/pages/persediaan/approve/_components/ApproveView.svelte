<script>
  import { getApplicationContext } from "__@modules/app";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { writable } from "svelte/store";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import TransactionItems from "./TransactionItems.svelte";
  import AccountAmountTable from "__@comps/transactions/AccountAmountTable.svelte";

  const { loading, notify } = getApplicationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();

  /**
   * @type{import("@deboxsoft/accounting-api").StockTransaction}
   */
  export let stockTransaction;
  export let userPromise;
  let userName = writable("....load");

  userPromise.then((_) => {
    $userName = _.name;
  });

  function calculate() {
    const total = stockTransaction.productItems.reduce((_, item) => {
      return _ + item.quantity * item.price;
    }, 0);
    return {
      total,
      payableAmount: total - stockTransaction.cashAmount
    };
  }

  const calc = calculate();
</script>

<dl class="row">
  <dt class="col-sm-3 mb-0">Tanggal</dt>
  <p class="col-sm-9 mb-0">
    : <CellDate date={stockTransaction.date} />
  </p>
  {#if stockTransaction.mutation === "STOCK_IN"}
    <dt class="col-sm-3 mb-0">No. Nota/Kwitansi</dt>
    <p class="col-sm-9 mb-0">
      : {stockTransaction.no || "-"}
    </p>
    <dt class="col-sm-3 mb-0">Tanggal Pembelian</dt>
    <p class="col-sm-9 mb-0">
      : <CellDate date={stockTransaction.datePurchase} />
    </p>
    <dt class="col-sm-3 mb-0">Akun Persediaan</dt>
    <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={stockTransaction.stockAccount} />
    </p>
    <dt class="col-sm-3 mb-0">Mutasi</dt>
    <p class="col-sm-9 mb-0 d-inline-flex align-items-center">: Masuk</p>
  {:else}
    <dt class="col-sm-3 mb-0">Akun Biaya</dt>
    <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={stockTransaction.expenseAccount} />
    </p>
    <dt class="col-sm-3 mb-0">Akun di Kredit</dt>
    <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={stockTransaction.stockAccount} />
    </p>
    <dt class="col-sm-3 mb-0">Mutasi</dt>
    <p class="col-sm-9 mb-0 d-inline-flex align-items-center">: Keluar</p>
  {/if}
  <dt class="col-sm-3 mb-0">Deskripsi</dt>
  <p class="col-sm-9 mb-0">: {stockTransaction.description || "-"}</p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<TransactionStatus status={stockTransaction.status} />
  </p>
  <dt class="col-sm-3 mb-0">Di Input Oleh</dt>
  <p class="col-sm-9 mb-0">: {$userName || "-"}</p>
  <dt class="col-sm-3 mb-0">Total Keseluruhan</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px"><CellNumber value={calc.total} /></div>
  </div>
</dl>
{#if stockTransaction.paymentAccounts}
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">Pembayaran</dt>
    <p class="col-sm-9 mb-0">:</p>
  </dl>
  <AccountAmountTable dataList={stockTransaction.paymentAccounts} />
{/if}
<dl class="row mb-0 mt-2">
  <dt class="col-sm-3 mb-0">Daftar Barang</dt>
  <p class="col-sm-9 mb-0">:</p>
</dl>
<TransactionItems {stockTransaction} />
