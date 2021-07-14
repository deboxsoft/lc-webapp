<script>
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import Table from "__@comps/Table.svelte";
  import Button from "__@comps/Button.svelte";

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
  {#each transactions as transaction}
    <div class="dbx-tr">
      <div class="dbx-cell d-none d-md-flex no">{transaction.id || ""}</div>
      <div class="dbx-cell date">
        {dayjs(transaction.date).format("DD-MM-YY") || ""}
      </div>
      <div class="dbx-cell d-none d-xl-flex account">
        <CellAccount id={transaction.accountId} />
      </div>
      <div class="dbx-cell">{transaction.description || ""}</div>
      <div class="dbx-cell amount">
        <CellRp value={transaction.amount} />
      </div>
      <div class="dbx-cell d-none d-sm-flex status">
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
