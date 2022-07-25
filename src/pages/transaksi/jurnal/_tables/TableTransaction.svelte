<script>
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import Table from "__@comps/tables/DataTable.svelte";
  import Button from "__@comps/Button.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import CellDate from "__@comps/CellDate.svelte";

  const { loading } = getApplicationContext();
  const { transactionPageInfo, findPage } = stores.getTransactionContext();

  export let transactions = [];
  export let infiniteHandler;
  // state
  export let submitting = false;

  function createClickHandler(transaction) {
    return () => {
      $goto("./:id/view", { id: transaction.id });
    };
  }

  const classes = {
    no: "d-none d-md-table-cell",
    date: "text-center",
    debit: "d-none d-xl-table-cell debit",
    description: "description",
    amount: "",
    status: "d-none d-sm-table-cell text-center"
  };
</script>

<div style="overflow-x: auto">
  <Table class="table-hover">
    <tr slot="header">
      <th class={classes.no} width="80">No Transaksi</th>
      <th class={classes.date} width="100">Tanggal</th>
      <th class={classes.debit} width="200">Debit</th>
      <th class={classes.description}>Deskripsi</th>
      <th class={classes.amount} width="160">Jumlah</th>
      <th class={classes.status} width="50">Status</th>
      <th width="30" />
    </tr>
    {#each transactions as transaction (transaction.id)}
      <tr class="cursor-pointer">
        <td class={classes.no} on:click={createClickHandler(transaction)}>
          {transaction.id}
        </td>
        <td class={classes.date} on:click={createClickHandler(transaction)}>
          <CellDate date={transaction.date} />
        </td>
        <td class={classes.debit} on:click={createClickHandler(transaction)}>
          <CellAccount id={transaction.accountId} />
        </td>
        <td class={classes.description} style="text-overflow: ellipsis" on:click={createClickHandler(transaction)}>
          <div>
            {transaction.description || ""}
          </div>
        </td>
        <td class={classes.amount} on:click={createClickHandler(transaction)}>
          <CellNumber value={transaction.amount} />
        </td>
        <td class={classes.status} on:click={createClickHandler(transaction)}>
          <TransactionStatus status={transaction.status} />
        </td>
        <td style="cursor: pointer;padding: 0">
          <MenuListTransaction bind:transaction />
        </td>
      </tr>
    {/each}
  </Table>
</div>
{#if $transactionPageInfo.hasNext}
  <div class="" style="height: 50px">
    <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}>
      <i class="icon-chevron-down mr-2" />
      Muat Lebih Banyak...
    </Button>
  </div>
{/if}

<style lang="scss">
  .description,
  .debit {
    white-space: normal;
  }
</style>
