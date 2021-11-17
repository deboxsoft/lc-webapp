<script>
  import { stores } from "@deboxsoft/accounting-client";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();
  /**
   * @type{import("@deboxsoft/accounting-api").InventoryDetail}
   */
  export let inventory;
  const transaction = inventory.transaction;
</script>

<dl class="row">
  <dt class="col-sm-3 mb-0">Nama</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.name || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Tanggal Pembelian</dt>
  <p class="col-sm-9 mb-0">: <CellDate date={inventory.date} format="DD-MMMM-YYYY" /></p>
  {#if transaction}
    <dt class="col-sm-3 mb-0">Tanggal Transaksi</dt>
    <p class="col-sm-9 mb-0">: <CellDate date={transaction.dateTransaction} format="DD-MMMM-YYYY" /></p>
    <dt class="col-sm-3 mb-0">No Transaksi</dt>
    <p class="col-sm-9 mb-0">: {transaction?.id || "-"}</p>
  {/if}
  <dt class="col-sm-3 mb-0">Kategori</dt>
  <p class="col-sm-9 mb-0">
    : {getCategoryInventory(inventory.categoryId)?.name || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Merk/Type/Spec</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.brand || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Kondisi</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.condition || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Lokasi Barang</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.location || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Penanggung Jawab</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.person || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Akun Debit</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={inventory.debitAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Akun Kredit</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={inventory.creditAccount} />
  </p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0">
    :
    <TransactionStatus status={inventory?.status || "-"} />
  </p>
  <dt class="col-sm-3 mb-0">Harga Barang</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={inventory.priceItem} /></span>
  </p>
  <dt class="col-sm-3 mb-0">Jumlah Barang</dt>
  <p class="col-sm-9 mb-0">
    : {inventory.quantity || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Harga Total Barang</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={inventory.quantity * inventory.priceItem} /></span>
  </p>
</dl>
{#if transaction}
  <TransactionList {transaction} />
{/if}
