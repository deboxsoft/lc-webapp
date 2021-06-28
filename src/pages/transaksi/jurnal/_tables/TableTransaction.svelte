<script>
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import Table from "__@comps/Table.svelte";
  import InfiniteScroll from "__@comps/InfiniteScroll.svelte";

  const { loading } = getApplicationContext();
  const { transactionPageInfo, find } = stores.getTransactionContext();

  export let transactions = [];
  export let filter;

  // state
  let submitting = false;

  export async function infiniteHandler() {
    submitting = true;
    $loading = true;
    await find(
      {
        filter,
        pageCursor: {
          next: $transactionPageInfo.next
        }
      },
      { more: true }
    );
    submitting = false;
    $loading = false;
  }
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell no">No Transaksi</div>
    <div class="dbx-cell date">Tanggal</div>
    <div class="dbx-cell account">Debit</div>
    <div class="dbx-cell ">Deskripsi</div>
    <div class="dbx-cell amount">Jumlah</div>
    <div class="dbx-cell status">Status</div>
    <div class="dbx-cell -menu-list" />
  </div>
  {#each transactions as transaction}
    <div class="dbx-tr">
      <div class="dbx-cell no">{transaction.id || ""}</div>
      <div class="dbx-cell date">
        {dayjs(transaction.date).format("DD-MM-YY") || ""}
      </div>
      <div class="dbx-cell account">
        <CellAccount id={transaction.accountId} />
      </div>
      <div class="dbx-cell">{transaction.description || ""}</div>
      <div class="dbx-cell amount">
        <CellRp value={transaction.amount} />
      </div>
      <div class="dbx-cell status">
        <span
          class="badge"
          class:badge-primary={transaction.status === "UNAPPROVED"}
          class:badge-danger={transaction.status === "REJECTED"}
          class:badge-light={transaction.status === "FIXED"}
          class:badge-success={transaction.status === "APPROVED"}>{transaction.status}</span
        >
      </div>
      <div class="dbx-cell -menu-list" style="width: 30px">
        <MenuListTransaction bind:transaction />
      </div>
    </div>
  {/each}
  <!--{#if $transactionPageInfo.hasNext}-->
  <!--  <div class="dbx-tr">-->
  <!--    <Button class="btn btn-light w-100" on:click={infiniteHandler} {submitting}> Load More </Button>-->
  <!--  </div>-->
  <!--{/if}-->
  <InfiniteScroll
    elementScroll={window}
    hasMore={$transactionPageInfo.hasNext}
    on:loadMore={infiniteHandler}
    threshold={100}
  />
</Table>

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
    flex: 0 0 200px;
  }

  .amount {
    flex: 0 0 200px;
  }

  .status {
    flex: 0 0 90px;
  }
</style>
