<script>
  import dayjs from "dayjs";
  import CellNumber from "__@comps/CellNumber.svelte";
  import Table from "__@comps/tables/DataTable.svelte";

  export let generalLedgerStore;
</script>

<Table>
  <tr slot="header">
    <th style="width: 100px">Tanggal</th>
    <th style="width: 120px">No Transaksi</th>
    <th>Deskripsi</th>
    <th style="width: 160px">Debit</th>
    <th style="width: 160px">Kredit</th>
    <th style="width: 160px">Saldo</th>
  </tr>
  {#each $generalLedgerStore as generalLedger}
    <tr>
      <td>
        {dayjs(generalLedger.date).format("DD-MM-YY") || ""}
      </td>
      <td>
          {generalLedger.transactionId}
      </td>
      <td>
        {generalLedger.description || ""}
      </td>
      <td>
        <CellNumber value={generalLedger.amount > 0 ? generalLedger.amount : undefined} />
      </td>
      <td>
        <CellNumber value={generalLedger.amount < 0 ? -1 * generalLedger.amount : undefined} />
      </td>
      <td>
        <CellNumber value={generalLedger.balance} />
      </td>
    </tr>
  {/each}
</Table>
<slot />
