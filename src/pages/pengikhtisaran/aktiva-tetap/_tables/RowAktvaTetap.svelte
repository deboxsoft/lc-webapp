<script lang="ts">
  import type { BankReconciliation } from "@deboxsoft/accounting-api";
  // import { lightFormat, parseISO } from "date-fns";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getAccountContext } from "__@modules/transaksi/perkiraan";
  import { convertToRp } from "__@root/utils";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  const { getAccount } = getAccountContext();

  export let bankReconciliation: BankReconciliation;
  // export let index: number;
  export let expanded: boolean = false;

  let classes = "";
  const account = getAccount(bankReconciliation.accountId);
  $: classes = clsx("odd", expanded && "parent");
</script>

<tr class={classes} style="cursor: pointer" on:click>
  <td class="control d-table-cell">{bankReconciliation.bank || ''}</td>
  <td class="d-none d-lg-table-cell">{bankReconciliation.accountBank || ''}</td>
  <td class="d-none d-xl-table-cell">
    <CellAccount />
  </td>
  <td>{convertToRp(bankReconciliation.balance)}</td>
  <td>{convertToRp($account.total)}</td>
  <td>Unreconciled</td>
  <td>{''}</td>
</tr>
