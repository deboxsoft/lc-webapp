<script>
  import Table from "../../../components/tables/DataTable.svelte";
  import DepreciationRow from "./DepreciationRow.svelte";
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getGroupDepreciation, calculateDepreciation } from "@deboxsoft/accounting-api";
  import CellRp from "../../../components/CellRp.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();
  export let back = "../";
  /** @type {import("@deboxsoft/accounting-api").Inventory} */
  export let inventory;
  const category = getCategoryInventory(inventory.categoryId);
  /** @type {import("@deboxsoft/accounting-api").Depreciation[]} */
  const depreciationList = inventory.logs || [];
  const groupDepreciation = getGroupDepreciation(category.groupDepreciationId);
  const useMonthLife = groupDepreciation.useLife * 12;
  const date = dayjs(inventory.date);
  const countDepreciation = depreciationList.length;
  const depreciationAmount =
    useMonthLife > countDepreciation ? calculateDepreciation({ inventory, category }) : inventory.quantity;
  const totalDepreciation = depreciationList.reduce(((tot, depreciation) => tot + depreciation.amount), 0);
</script>
<div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Kelompok</dt>
    <p class="col-sm-7 mb-0">: {groupDepreciation.label}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Usia Pakai</dt>
    <p class="col-sm-7 mb-0">: {`${useMonthLife} bulan`}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Biaya Depresiasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellRp value={depreciationAmount} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Residu</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellRp value={inventory.quantity} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Jumlah Bulan Akumulasi Depresiasi</dt>
    <p class="col-sm-7 mb-0">: {`${depreciationList.length} bulan`}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Total Akumulasi Depresiasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellRp value={totalDepreciation} /></span>
    </p>
  </dl>
</div>
<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th>Bulan</th>
      <th>Biaya Depresiasi</th>
<!--      <th style="width: 30px;" />-->
    </tr>
    {#each depreciationList as depreciation}
      <DepreciationRow {depreciation} />
    {/each}
  </Table>
</div>
