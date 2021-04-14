<script lang="ts">
  import RowBukuBesar from "./RowBukuBesar.svelte";
  import { getGeneralLedgerContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { generalLedgerStore } = getGeneralLedgerContext();

  let statements;
  export let loading;
  // recalculate saldo
  $: {
    if (Array.isArray($generalLedgerStore)) {
      let _lastBalance = 0;
      statements = $generalLedgerStore.reduce((result, _) => {
        const balance = _lastBalance + _.balance;
        _lastBalance = balance;
        return [...result, { ..._, balance }];
      }, []);
    }
  }
</script>

<Table items={statements} let:item>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center" style="width: 200px;">Tanggal</div>
    <div class="dbx-cell text-center" style="width: 250px">No Transaksi</div>
    <div class="dbx-cell">Deskripsi</div>
    <div class="dbx-cell" style="width: 400px;">Mutasi</div>
    <div class="dbx-cell" style="width: 350px;">Saldo</div>
  </div>
  {#if loading}
    <Loader />
  {:else}
    <RowBukuBesar generalLedger={item} />
  {/if}
</Table>
