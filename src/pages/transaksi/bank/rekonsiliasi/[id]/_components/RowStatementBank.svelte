<script lang="ts">
  import type { BankStatement } from "@deboxsoft/accounting-api";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext } from "__@modules/accounting";

  export let bankStatement: BankStatement;
  export let selected: boolean = true;
  export let showCheckbox: boolean = false;
  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(bankStatement.accountId);
</script>

<tr class:selected>
  {#if showCheckbox}
    <td class="select-checkbox" />
  {/if}
  <td class="text-center">{bankStatement.date || ''}</td>
  <td>{bankStatement.description || ''}</td>
  <td class="text-right">{convertToRp(bankStatement.in)}</td>
  <td class="text-right">{convertToRp(bankStatement.out)}</td>
  <td class="text-right">{convertToRp(bankStatement.balance)}</td>
</tr>
