<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import DepreciationRow from "./DepreciationRow.svelte";
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getGroupDepreciation, calcDepreciation } from "@deboxsoft/accounting-api";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { getCategoryInventory, getDepreciationInventory } = stores.getInventoryContext();
  export let back = "../";
  /** @type {import("@deboxsoft/accounting-api").Inventory} */
  export let inventory;
  /** @type {import("@deboxsoft/accounting-api").Depreciation[]} */
  let depreciationList = [];
  let loading = true;

  getDepreciationInventory(inventory.id).then((_) => {
    depreciationList = _;
    loading = false;
  });

  const category = getCategoryInventory(inventory.categoryId);
  let groupDepreciation;
  if (category.groupDepreciationId) {
    groupDepreciation = category?.groupDepreciationId && getGroupDepreciation(category.groupDepreciationId);
  }
  const { bookValue, depreciationRemaining, depreciationAccumulation, depreciationAmount, monthLife, total } =
    calcDepreciation({
      depreciationCount: inventory.depreciationCount || 0,
      priceItem: inventory.priceItem,
      quantity: inventory.quantity,
      groupDepreciationId: category.groupDepreciationId
    });
  const date = dayjs(inventory.date);
</script>

<div class="border-bottom-grey-600 mb-1 pb-1" class:border-bottom-1={groupDepreciation}>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nama</dt>
    <p class="col-sm-7 mb-0">: {inventory.name}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal Approve</dt>
    <p class="col-sm-7 mb-0">: <CellDate date={inventory.date} /></p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal Perolehan</dt>
    <p class="col-sm-7 mb-0">: <CellDate date={inventory.datePurchase} /></p>
  </dl>
  {#if groupDepreciation}
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Tanggal Akhir</dt>
      <p class="col-sm-7 mb-0">: <CellDate date={inventory.dateEnd} /></p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Kelompok</dt>
      <p class="col-sm-7 mb-0">: {groupDepreciation?.label || "-"}</p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Umur</dt>
      <p class="col-sm-7 mb-0">: {`${monthLife} bulan`}</p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Jumlah Penyusutan</dt>
      <p class="col-sm-7 mb-0">: {`${inventory.depreciationCount} dari ${monthLife} bulan`}</p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Disusutkan Setiap Tanggal</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span style="width: 150px"><CellNumber format="number" value={inventory.depreciationDayOfMonth} /></span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Nilai Penyusutan</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span style="width: 150px"><CellNumber value={depreciationAmount} /></span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Akumulasi Penyusutan</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span style="width: 150px"><CellNumber value={depreciationAccumulation} /></span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Nilai Buku</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span style="width: 150px"><CellNumber value={bookValue} /></span>
      </p>
    </dl>
  {/if}
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Jumlah Barang</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp
      <span style="width: 150px"><CellNumber format="number" value={inventory.quantity} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Harga Satuan</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp
      <span style="width: 150px"><CellNumber value={inventory.priceItem} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Total Harga</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp
      <span style="width: 150px"><CellNumber value={total} /></span>
    </p>
  </dl>
</div>
{#if groupDepreciation}
  <div class="depreciation-data">
    {#if loading}
      <Loader />
    {:else}
      <Table class="table table-hover text-nowrap">
        <tr slot="header">
          <th>Bulan</th>
          <th>Biaya Penyusutan</th>
          <!--      <th style="width: 30px;" />-->
        </tr>
        {#each depreciationList as depreciation}
          <DepreciationRow {depreciation} />
        {/each}
      </Table>
    {/if}
  </div>
{/if}

<style>
  .depreciation-data {
    height: 250px;
    overflow-y: auto;
  }
</style>
