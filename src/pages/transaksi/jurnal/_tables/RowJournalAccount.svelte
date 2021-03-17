<script lang="ts">
  import type { JournalAccount} from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/accounting";
  import CellRp from "__@comps/CellRp.svelte";

  const { getAccount, accountStore } = getAccountContext();
  export let journalAccount: JournalAccount;
  const account = getAccount({ id:journalAccount.accountId });
</script>

<tr>
  <td>{account?.code}</td>
  <td>{account?.name}</td>
  <td>
    <CellRp spaceMinus value={journalAccount.isCredit ? -1 * journalAccount.amount : journalAccount.amount} />
  </td>
</tr>
