<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { convertToRp } from "__@root/utils";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  export let balanceSheet: BalanceSheet;
  let classes = "";
  $: classes = clsx("odd");
</script>

<tr class={classes} style="cursor: pointer" on:click>
  <td class="d-none d-xl-table-cell">
    <CellAccount id={balanceSheet.accountId} />
  </td>
  <td>{convertToRp(balanceSheet.amount)}</td>
</tr>
