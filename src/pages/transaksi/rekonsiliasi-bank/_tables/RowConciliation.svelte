<script lang="ts">
  import type { BankReconciliation } from "@deboxsoft/accounting-api";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext } from "__@modules/accounting";
  import CellAccount from "../../akun-perkiraan/_tables/CellAccount.svelte";

  export let bankReconciliation: BankReconciliation;
  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(bankReconciliation.accountId);

  let classes = "";
  $: classes = clsx();
</script>

<tr class={classes} on:click>
  <td class="d-table-cell">{bankReconciliation.bank || ''}</td>
  <td class="d-none d-lg-table-cell">{bankReconciliation.accountBank || ''}</td>
  <td class="d-none d-xl-table-cell">
    <CellAccount account={$account} />
  </td>
  <td class="text-right">{convertToRp(bankReconciliation.balance)}</td>
  <td class="text-right">{convertToRp('1000')}</td>
  <td class="text-center">Unreconciled</td>
  <td>{''}</td>
</tr>
