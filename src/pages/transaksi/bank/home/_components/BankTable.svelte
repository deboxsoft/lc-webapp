<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/tables/DataTable.svelte";
  import BankRow from "./BankRow.svelte";
  import { createEventDispatcher } from "svelte";

  const { getAccount } = stores.getAccountContext();
  const dispatch = createEventDispatcher();
  export let bankStore;

  function createClickRowHandler(bank) {
    return () => {
      dispatch("select", bank);
    };
  }
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
    <BankRow class="dbx-tr" {bank} on:click={createClickRowHandler(bank)} />
  {/each}
</Table>
