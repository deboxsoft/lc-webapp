<script lang="ts">
  import type { BankReconciliationHistory } from "@deboxsoft/accounting-api";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext } from "__@modules/accounting";

  export let history: BankReconciliationHistory;
  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(history.accountId);

  let classes = "";
  $: classes = clsx();
</script>

<tr class={classes} on:click>
  <td class="d-table-cell">{history.importDate || ''}</td>
  <td class="d-none d-lg-table-cell">{history.startDate || ''}</td>
  <td class="d-none d-lg-table-cell">{history.endDate || ''}</td>
  <td class="text-right">{convertToRp(history.openingBalance)}</td>
  <td class="text-right">{convertToRp(history.lastBalance)}</td>
  <td class="text-center">{history.status}</td>
  <td>{''}</td>
</tr>
