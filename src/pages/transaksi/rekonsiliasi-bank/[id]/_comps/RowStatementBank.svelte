<script lang="ts">
  import type { StatementBank } from "@deboxsoft/accounting-api";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext } from "__@modules/accounting";

  export let statementBank: StatementBank;
  export let selected: boolean = true;
  export let showCheckbox: boolean = false;
  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(statementBank.accountId);
</script>

<tr class:selected>
  {#if showCheckbox}
    <td class="select-checkbox" />
  {/if}
  <td class="text-center">{statementBank.date || ''}</td>
  <td>{statementBank.description || ''}</td>
  <td class="text-right">{convertToRp(statementBank.in)}</td>
  <td class="text-right">{convertToRp(statementBank.out)}</td>
  <td class="text-right">{convertToRp(statementBank.balance)}</td>
</tr>
