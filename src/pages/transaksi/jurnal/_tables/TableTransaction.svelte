<script lang="ts">
  import RowTransaction from "./RowTransaction.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";

  export let height;

  const { transactionStore } = getTransactionContext();
</script>

<Table items={$transactionStore} {height} let:item>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center" style="width: 250px;">No Transaksi</div>
    <div class="dbx-cell text-center" style="width: 200px">Tanggal</div>
    <div class="dbx-cell" style="width: 350px">Akun Debit</div>
    <div class="dbx-cell ">Deskripsi</div>
    <div class="dbx-cell" style="width: 350px;">Jumlah</div>
    <div class="dbx-cell text-center" style="width: 200px">Status</div>
    <div class="dbx-cell text-center" style="width: 30px;" />
  </div>
  <RowTransaction transaction={item} />
</Table>
