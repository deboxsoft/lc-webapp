<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import dayjs from "dayjs";
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";

  /** @type{import("@deboxsoft/accounting-api").BddDetail} */
  export let bdd;
  const transaction = bdd.transaction;
</script>

<dl class="row">
  <dt class="col-sm-3 mb-0">Tanggal</dt>
  <p class="col-sm-9 mb-0">: <CellDate date={bdd.date} format="DD-MMMM-YYYY" /></p>
  <dt class="col-sm-3 mb-0">Tanggal Awal</dt>
  <p class="col-sm-9 mb-0">: <CellDate date={bdd.dateStart} format="DD-MMMM-YYYY" /></p>
  <dt class="col-sm-3 mb-0">Tanggal Akhir</dt>
  <p class="col-sm-9 mb-0">: <CellDate date={bdd.dateEnd} format="DD-MMMM-YYYY" /></p>
  {#if transaction}
    <dt class="col-sm-3 mb-0">No Transaksi</dt>
    <p class="col-sm-9 mb-0">: {transaction?.id || "-"}</p>
    <dt class="col-sm-3 mb-0">Status Transaksi</dt>
    <p class="col-sm-9 mb-0">
      :
      <TransactionStatus status={transaction?.status} />
    </p>
  {/if}
  <dt class="col-sm-3 mb-0">Keterangan</dt>
  <p class="col-sm-9 mb-0">
    : {bdd.description || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Pajak (%)</dt>
  <p class="col-sm-9 mb-0">
    : {bdd.taxRate || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0">
    :
    <TransactionStatus status={bdd?.status || "-"} />
  </p>
  <dt class="col-sm-3 mb-0">Jumlah</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={bdd.amount} /></span>
  </p>
</dl>
{#if transaction}
  <TransactionList {transaction} />
{/if}
