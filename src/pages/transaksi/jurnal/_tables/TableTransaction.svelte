<script lang="ts">
  import RowTransaction from "./RowTransaction.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { transactionStore, transactionPageInfo, load } = getTransactionContext();

  export let filter = {};

  // state
  let loading = true;
  load().then(() => {
    loading = false;
  });

  export function fetchMoreHandler() {
    console.log("more");
  }
</script>

<Table items={$transactionStore} let:item on:infinite={fetchMoreHandler}>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center" style="width: 250px;">No Transaksi</div>
    <div class="dbx-cell text-center" style="width: 200px">Tanggal</div>
    <div class="dbx-cell" style="width: 350px">Akun Debit</div>
    <div class="dbx-cell ">Deskripsi</div>
    <div class="dbx-cell" style="width: 350px;">Jumlah</div>
    <div class="dbx-cell" style="width: 200px">Status</div>
    <div class="dbx-cell text-center" style="width: 30px;" />
  </div>
  {#if loading}
    <Loader />
  {:else}
    <RowTransaction transaction={item} />
  {/if}
</Table>
