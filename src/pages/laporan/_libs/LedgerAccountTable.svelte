<script>
  import dayjs from "dayjs";
  import CellRp from "../../../components/CellRp.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "../../../components/Table.svelte";
  import Button from "../../../components/Button.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { loading } = getApplicationContext();

  const { generalLedgerStore, generalLedgerPageInfo, findPageGeneralLedger } = stores.getGeneralLedgerContext();

  export let account;
  export let filter;
  let submitting = false;

  function infiniteHandler() {
    submitting = true;
    $loading = true;
    findPageGeneralLedger(
      $account.id,
      {
        filter,
        pageCursor: {
          next: $generalLedgerPageInfo.next
        }
      },
      {
        more: true
      }
    ).then(() => {
      submitting = false;
      $loading = false;
    });
  }
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell date">Tanggal</div>
    <div class="dbx-cell no">No Transaksi</div>
    <div class="dbx-cell">Deskripsi</div>
    <div class="dbx-cell amount">Debit</div>
    <div class="dbx-cell amount">Kredit</div>
    <div class="dbx-cell balance">Saldo</div>
  </div>
  {#each $generalLedgerStore as generalLedger}
    <div class="dbx-tr">
      <div class="dbx-cell date">
        {dayjs(generalLedger.date).format("DD-MM-YY") || ""}
      </div>
      <div class="dbx-cell no">
          {generalLedger.transactionId}
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
  {/each}
  {#if $generalLedgerPageInfo.hasNext}
    <div class="dbx-tr" style="width: 50px">
      <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}>
        <i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
      </Button>
    </div>
  {/if}
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
