<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/tables/DataTable.svelte";
  import BankRow from "./BankRow.svelte";

  const { getAccount } = stores.getAccountContext();

  export let bankStore;

</script>

<Table>
  <tr slot="header">
    <th>Bank</th>
    <th>Rekening</th>
    <th>Akun Perkiraan</th>
    <th>Saldo Bank</th>
    <th>Saldo Akun Perkiraan</th>
    <th>Selisih</th>
    <th />
  </tr>
  {#each $bankStore as bank (bank.id)}
    <BankRow class="dbx-tr" {bank} />
  {/each}
</Table>

<style lang="scss">
  .dbx-table {
    .bank {
      width: 150px;
    }

    .account {
      width: 100px;
    }

    .name {
      flex: 0 0 150px;
    }

    .balance {
      flex: 0 0 150px;
    }
  }
</style>
