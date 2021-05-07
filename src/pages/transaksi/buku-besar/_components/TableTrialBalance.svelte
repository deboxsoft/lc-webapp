<script>
  import { lightFormat, parse } from "date-fns";
  import CellRp from "__@comps/CellRp.svelte";
  import { getGeneralLedgerContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";

  const { generalLedgerStore } = getGeneralLedgerContext();
</script>

  <Table items={$generalLedgerStore} let:item={generalLedger}>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell date">Tanggal</div>
      <div class="dbx-cell no">No Transaksi</div>
      <div class="dbx-cell">Deskripsi</div>
      <div class="dbx-cell amount">Debit</div>
      <div class="dbx-cell amount">Kredit</div>
      <div class="dbx-cell balance">Saldo</div>
    </div>
    <div class="dbx-tr">
      <div class="dbx-cell date">
        {lightFormat(parse(generalLedger.date, "T", new Date()), "dd-M-yyyy") || ""}
      </div>
      <div class="dbx-cell no">
<!--        <a-->
<!--          href="/#"-->
<!--          on:click|preventDefault={() =>-->
<!--            $goto(-->
<!--              "/transaksi/jurnal/:id/view",-->
<!--              { id: generalLedger.transactionId, backUrl: "/transaksi/buku-besar" },-->
<!--              true,-->
<!--              true-->
<!--            )}-->
<!--          target="_self"-->
<!--        >-->
          {generalLedger.transactionId}
<!--        </a>-->
      </div>
      <td class="dbx-cell">
        {generalLedger.description || ""}
      </td>
      <div class="dbx-cell amount" style="width: 200px">
        <CellRp value={generalLedger.amount > 0 ? generalLedger.amount : undefined} />
      </div>
      <div class="dbx-cell amount" style="width: 200px">
        <CellRp value={generalLedger.amount < 0 ? -1 * generalLedger.amount : undefined} />
      </div>
      <div class="dbx-cell balance">
        <CellRp value={generalLedger.balance} />
      </div>
    </div>
  </Table>

<style lang="scss">
  .no {
    text-align: center;
    flex: 0 0 125px;
  }

  .date {
    text-align: center;
    flex: 0 0 75px;
  }

  .amount {
    flex: 0 0 200px;
  }

  .balance {
    flex: 0 0 200px;
  }
</style>
