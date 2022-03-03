<script>
  import { goto, url } from "@roxi/routify";
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import Table from "__@comps/Table.svelte";
  import Button from "__@comps/Button.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import CellDate from "__@comps/CellDate.svelte";

  const { loading } = getApplicationContext();
  const { transactionPageInfo, findPage } = stores.getTransactionContext();

  export let transactions = [];
  export let filter;

  // state
  let submitting = false;

  export async function infiniteHandler() {
    submitting = true;
    $loading = true;
    await findPage(
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

  function createClickHandler(transaction) {
    return () => {
      $goto("./:id/view", { id: transaction.id });
    };
  }
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell d-none d-md-flex no">No Transaksi</div>
    <div class="dbx-cell date">Tanggal</div>
    <div class="dbx-cell d-none d-xl-flex account">Debit</div>
    <div class="dbx-cell ">Deskripsi</div>
    <div class="dbx-cell amount">Jumlah</div>
    <div class="dbx-cell d-none d-sm-flex status">Status</div>
    <div class="dbx-cell -menu-list" />
  </div>
  {#each transactions as transaction (transaction.id)}
    <div class="dbx-tr cursor-pointer">
      <div class="dbx-cell d-none d-md-flex no" on:click={createClickHandler(transaction)}>
        {transaction.id}
      </div>
      <div class="dbx-cell date" on:click={createClickHandler(transaction)}>
        <CellDate date={transaction.date} />
      </div>
      <div class="dbx-cell d-none d-xl-flex account" on:click={createClickHandler(transaction)}>
        <CellAccount id={transaction.accountId} />
      </div>
      <div class="dbx-cell" on:click={createClickHandler(transaction)}>{transaction.description || ""}</div>
      <div class="dbx-cell amount" on:click={createClickHandler(transaction)}>
        <CellNumber value={transaction.amount} />
      </div>
      <div class="dbx-cell d-none d-sm-flex status" on:click={createClickHandler(transaction)}>
        <TransactionStatus status={transaction.status} />
      </div>
      <div class="dbx-cell -menu-list" style="width: 30px">
        <MenuListTransaction bind:transaction />
      </div>
    </div>
  {/each}
  {#if $transactionPageInfo.hasNext}
    <div class="dbx-tr" style="height: 50px">
      <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
        ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
      </Button>
    </div>
  {/if}
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
