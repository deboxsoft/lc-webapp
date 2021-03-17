<script lang="ts">
  import { neracaParsingUtils } from "__@root/utils";

  import CellRp from "__@comps/CellRp.svelte";
  import Row from "./RowNeraca.svelte";
  import { getGeneralLedgerContext, getAccountContext } from "__@modules/accounting";

  const { balanceSheetStore } = getGeneralLedgerContext();
  const { accountTypeStore, accountStore } = getAccountContext();

  let dataList;
  let getDataNeraca = neracaParsingUtils({ accounts: $accountStore, accountsType: $accountTypeStore });
  $: {
    dataList = getDataNeraca($balanceSheetStore);
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
    {#each dataList.aktivaLancar.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Aktiva Lancar</td>
      <td class="text-right" style="width: 200px">
        <CellRp value={dataList.aktivaLancar.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each dataList.aktivaTetap.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Aktiva Tetap</td>
      <td class="text-right">
        <CellRp value={dataList.aktivaTetap.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr class="table-active table-border-double font-weight-bold">
      <td>Total Aktiva</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={dataList.aktivaLancar.sum + dataList.aktivaTetap.sum} />
      </td>
    </tr>
    {#each dataList.pasiva.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Pasiva</td>
      <td class="text-right">
        <CellRp value={dataList.pasiva.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each dataList.cadangan.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Cadangan</td>
      <td class="text-right">
        <CellRp value={dataList.cadangan.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each dataList.modal.items as itemSaldo}
      <Row {itemSaldo} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Modal</td>
      <td class="text-right">
        <CellRp value={dataList.modal.sum} />
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr class="table-active table-border-double font-weight-bold">
      <td>Total Pasiva</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={dataList.pasiva.sum + dataList.cadangan.sum} />
      </td>
    </tr>
  </tbody>
</table>
