<script>
  import dayjs from "dayjs";
  import CellRp from "../../../components/CellRp.svelte";
  import Table from "../../../components/tables/DataTable.svelte";

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
        <CellRp value={generalLedger.amount > 0 ? generalLedger.amount : undefined} />
      </td>
      <td>
        <CellRp value={generalLedger.amount < 0 ? -1 * generalLedger.amount : undefined} />
      </td>
      <td>
        <CellRp value={generalLedger.balance} />
      </td>
    </tr>
  {/each}
</Table>
<slot />
