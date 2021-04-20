<script>
  import { format, parse } from "date-fns";
  import { getTransactionContext } from "__@modules/accounting";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import Table from "__@comps/Table.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { transactionStore, transactionPageInfo, load, find } = getTransactionContext();

  export const filter = {};

  // state
  let loading = true;
  load().then(() => {
    loading = false;
  });

  export function infiniteHandler() {
    // find({ filter }, { fetchMore: true });
    console.log("more");
  }
</script>

{#if loading}
  <Loader />
{:else}
  <Table items={$transactionStore} let:item={transaction} on:infinite={infiniteHandler}>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell no">No Transaksi</div>
      <div class="dbx-cell date">Tanggal</div>
      <div class="dbx-cell account">Debit</div>
      <div class="dbx-cell ">Deskripsi</div>
      <div class="dbx-cell amount">Jumlah</div>
      <div class="dbx-cell status">Status</div>
      <div class="dbx-cell -menu-list" />
    </div>
    <div class="dbx-tr">
      <div class="dbx-cell no">{transaction.id || ""}</div>
      <div class="dbx-cell date">
        {format(parse(transaction.date, "T", new Date()), "dd-MM-yy") || ""}
      </div>
      <div class="dbx-cell account">
        <CellAccount id={transaction.accountId} />
      </div>
      <div class="dbx-cell flex-grow-1">{transaction.description || ""}</div>
      <div class="dbx-cell amount">
        <CellRp value={transaction.amount} />
      </div>
      <div class="dbx-cell status">
        <span
          class="badge"
          class:badge-warning={transaction.status === "UNAPPROVED"}
          class:badge-success={transaction.status === "APPROVED"}>{transaction.status || ""}</span
        >
      </div>
      <div class="dbx-cell -menu-list" style="width: 30px">
        <MenuListTransaction {transaction} />
      </div>
    </div>
  </Table>
{/if}

<style lang="scss">
  .dbx-tr {
    .no {
      font-size: 0.9em;
    }
  }
  .no {
    text-align: center;
    flex: 0 0 125px;
  }
  .date {
    text-align: center;
    flex: 0 0 100px;
  }

  .account {
    flex: 0 0 150px;
  }

  .amount {
    flex: 0 0 200px;
  }

  .status {
    flex: 0 0 90px;
  }
</style>
