<script lang="ts">
  import { get } from "svelte/store";
  import { getBankStatementContext, getAccountContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { bankStatementStore, findStatement, bank } = getBankStatementContext();
  const { getAccount } = getAccountContext();
  export let bankStatementList = bankStatementStore;
  export let editable = false;
  export let loading;

</script>

<div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">Nama bank</dt>
    <p class="col-sm-9 mb-0">: <span class="font-weight-bold text-uppercase">{$bank.bank}</span></p>
    <dt class="col-sm-3 mb-0">No Rekening</dt>
    <p class="col-sm-9 mb-0">: {$bank.noAccountBank}</p>
    <dt class="col-sm-3 mb-0">An. Rekening</dt>
    <p class="col-sm-9 mb-0">: {$bank.nameAccountBank}</p>
    <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
    <p class="col-sm-9 mb-0">: {get(getAccount($bank.accountId)).name}</p>
  </dl>
</div>
{#if loading}
  <Loader />
{:else}
  <Table>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell date">Tanggal</div>
      <div class="dbx-cell">Diskripsi</div>
      <div class="dbx-cell amount">Masuk</div>
      <div class="dbx-cell amount">Keluar</div>
      <div class="dbx-cell amount">Saldo</div>
      <div class="dbx-cell account">Account</div>
    </div>
    {#each $bankStatementList as bankStatement, index}
      <div class="dbx-tr" class:editable>
        <div class="dbx-cell text-center date">{bankStatement.date || ""}</div>
        <div class="dbx-cell">{bankStatement.description || ""}</div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.in} /></div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.out} /></div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.balance} /></div>
        <div class="dbx-cell account" class:editable>
          {#if editable}
            <AccountSelect allowEmpty bind:accountId={bankStatement.accountId} />
          {:else}
            <AccountCell id={bankStatement.accountId} />
          {/if}
        </div>
      </div>
    {/each}
  </Table>
{/if}

<style lang="scss">
  .dbx-tr.editable {
    height: 45px;
    .dbx-cell {
      line-height: 40px;
    }
  }
  .date {
    flex: 0 0 100px;
  }

  .amount {
    flex: 0 0 150px;
  }

  .account {
    flex: 0 0 150px;
    &.editable {
      overflow: unset;
      flex: 0 0 250px;
      height: 37px;
    }
  }
</style>
