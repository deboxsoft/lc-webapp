<script lang="ts">
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/tables/DataTable.svelte";

  import Loader from "__@comps/loader/Loader.svelte";
  import RowBank from "./RowBank.svelte";

  const { bankStore, find } = stores.getBankContext();
  const { getAccount } = stores.getAccountContext();

  export let bankList;

  $: {
    bankList = $bankStore;
  }

  let loading = true;
  find().then(() => {
    loading = false;
  });
</script>

{#if loading}
  <Loader />
{:else}
  <Table items={bankList} let:item={bank}>
    <tr slot="header">
      <td>Bank</td>
      <td>Rekening</td>
      <td >Akun Perkiraan</td>
      <td>Saldo Bank</td>
      <td>Saldo Akun Perkiraan</td>
      <td>Selisih</td>
      <td />
    </tr>
    <RowBank class="dbx-tr" {bank} />
  </Table
  >
{/if}

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
