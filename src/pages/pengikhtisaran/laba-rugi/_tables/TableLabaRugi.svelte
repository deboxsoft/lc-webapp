<script lang="ts">
  import { labaRugiParsingUtils } from "__@root/utils";

  import CellRp from "__@comps/CellRp.svelte";
  import Row from "./RowLabaRugi.svelte";
  import { getGeneralLedgerContext, getAccountContext, getBalanceContext } from "__@modules/accounting";

  const { balanceSheetStore } = getGeneralLedgerContext();
  const { accountStore, getAccountTree } = getAccountContext();
  const { keys, getAccountsTree, getBalanceAccounts, getAccountMap } = getBalanceContext();

  let dataList = {};
  let loading = true;
  let accountsTree;
  let balanceAccounts;
  let accountsMapping;
  let getDataLabaRugi = labaRugiParsingUtils(getAccountTree());
  $: {
    accountsTree = getAccountsTree();
    balanceAccounts = getBalanceAccounts();
    if ($balanceSheetStore) {

      dataList = getDataLabaRugi($balanceSheetStore);
    }
  }
</script>

<table class="table text-nowrap">
  <thead>
    <tr role="row">
      <th>Akun</th>
      <th class="text-center" colspan="2">Saldo</th>
    </tr>
  </thead>
  <tbody>
    {#each dataList.pendapatan.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Pendapatan</td>
      <td class="text-right" style="width: 200px">
        <CellRp value={dataList.pendapatan.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each dataList.pendapatanLain.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Pendapatan Lain</td>
      <td class="text-right">
        <CellRp value={dataList.pendapatanLain.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr class="table-active table-border-double font-weight-bold">
      <td>Total Pendapatan</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={dataList.pendapatan.sum + dataList.pendapatanLain.sum} />
      </td>
    </tr>
    {#each dataList.beban.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Beban</td>
      <td class="text-right">
        <CellRp value={dataList.beban.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each dataList.bebanLain.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Beban Lain</td>
      <td class="text-right">
        <CellRp value={dataList.bebanLain.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr class="table-active table-border-double font-weight-bold">
      <td>Total Beban</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={dataList.beban.sum + dataList.bebanLain.sum} />
      </td>
    </tr>
  </tbody>
</table>
