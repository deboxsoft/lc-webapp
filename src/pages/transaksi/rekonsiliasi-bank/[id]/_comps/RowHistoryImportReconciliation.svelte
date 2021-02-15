<script lang="ts">
  import type { AccountBankImportHistory, BankReconciliation } from "@deboxsoft/accounting-api";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext } from "__@modules/accounting";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  export let accountBankImportHistory: AccountBankImportHistory;
  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(accountBankImportHistory.accountId);

  let classes = "";
  $: classes = clsx();
</script>

<tr class={classes} on:click>
  <td class="d-table-cell">{accountBankImportHistory.importDate || ''}</td>
  <td class="d-none d-lg-table-cell">{accountBankImportHistory.startDate || ''}</td>
  <td class="d-none d-lg-table-cell">{accountBankImportHistory.endDate || ''}</td>
  <td class="text-right">{convertToRp(accountBankImportHistory.openingBalance)}</td>
  <td class="text-right">{convertToRp(accountBankImportHistory.lastBalance)}</td>
  <td class="text-center">{accountBankImportHistory.status}</td>
  <td>{''}</td>
</tr>
