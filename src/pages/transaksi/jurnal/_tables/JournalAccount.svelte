<script lang="ts">
  import type { JournalAccount, Account } from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/transaksi/perkiraan";
  import { convertToRp } from "__@root/utils";
  import CellRp from "__@comps/CellRp.svelte";

  const { getAccount, findAccount, accountStore } = getAccountContext();
  export let journalAccount: JournalAccount;
  const account = getAccount(journalAccount.accountId);
</script>

<tr>
  <td>{$account?.code}</td>
  <td>{$account?.name}</td>
  <td>
    <CellRp spaceMinus value={journalAccount.isCredit ? -1 * journalAccount.amount : journalAccount.amount} />
  </td>
</tr>
