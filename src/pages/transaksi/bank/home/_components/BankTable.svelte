<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/tables/DataTable.svelte";
  import BankRow from "./BankRow.svelte";

  const { getAccount } = stores.getAccountContext();

  export let bankStore;
</script>

<Table>
  <tr slot="header">
    <th width="175">Bank</th>
    <th>Rekening</th>
    <th width="175">Akun Perkiraan</th>
    <th width="175">Saldo Bank</th>
    <th width="175">Saldo Akun Perkiraan</th>
    <th width="175">Selisih</th>
    <th />
  </tr>
  {#each $bankStore as bank (bank.id)}
    <BankRow class="dbx-tr" {bank} />
  {/each}
</Table>
