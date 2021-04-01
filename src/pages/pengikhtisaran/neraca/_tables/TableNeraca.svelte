<script lang="ts">
  import Row from "./RowNeraca.svelte";
  import { onMount } from "svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import { getGeneralLedgerContext, getBalanceContext } from "__@modules/accounting";
  import LoaderContainer from "__@comps/loader/LoaderContainer.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { neracaParsingUtils } from "__@root/utils";

  const { balanceSheetStore } = getGeneralLedgerContext();
  const { keys, getAccountsTree, getBalanceAccounts, getAccountMap } = getBalanceContext();

  let dataList = {};
  let loading = true;
  let accountsTree;
  let balanceAccounts;
  let accountsMapping;

  $: {
    accountsTree = getAccountsTree();
    balanceAccounts = getBalanceAccounts();
    if ($balanceSheetStore) {
      const neracaParsing = neracaParsingUtils($accountsTree, balanceAccounts);
      dataList = neracaParsing($balanceSheetStore);
      if (dataList) {
        loading = false;
      }
    }
  }
</script>

{#if loading}
  <LoaderContainer>
    <Loader />
  </LoaderContainer>
{:else}
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
{/if}
