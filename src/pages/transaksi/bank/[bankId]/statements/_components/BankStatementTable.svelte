<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/tables/DataTable.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import CellDate from "__@comps/CellDate.svelte";

  const { bank } = stores.getBankStatementContext();
  const { getAccount, getAccountLeaf } = stores.getAccountContext();
  export let bankStatementList = undefined;
  export let preview = false;
  export let loading;
  export let errors = [];
  let isSelectAll = preview;

  $: accountChildren = getAccountLeaf();
</script>

{#if !bankStatementList}
  <Loader />
{:else}
  <Table>
    <tr slot="header">
      <th class="text-center" width="100">Tanggal</th>
      <th>Diskripsi</th>
      <th class="d-sm-none d-md-none d-xl-table-cell" width="150">Masuk</th>
      <th class="d-sm-none d-md-none d-xl-table-cell" width="150">Keluar</th>
      <th width="150">Saldo</th>
      <th width="200">Akun Perkiraan</th>
    </tr>
    {#each bankStatementList as bankStatement, index}
      <tr class:bg-danger-300={errors.includes(index)} class:preview>
        <td class="text-center date">
          <CellDate date={bankStatement.date} />
        </td>
        <td>{bankStatement.description || ""}</td>
        <td><CellNumber value={bankStatement.in} /></td>
        <td><CellNumber value={bankStatement.out} /></td>
        <td><CellNumber value={bankStatement.balance} /></td>
        <td>
          <div>
            <div>
              <AccountCell id={bankStatement.accountId} />
            </div>
            <div class="text-muted" style="font-size: 0.8em">
              {bankStatement.accountId || ""}
            </div>
          </div>
        </td>
      </tr>
    {/each}
  </Table>
  <slot />
{/if}

<style lang="scss">
  .check-item {
    flex: 0 0 30px;
  }
  .date {
    flex: 0 0 100px;
  }

  .amount {
    flex: 0 0 150px;
  }

  .account {
    flex: 0 0 200px;
  }
  .status {
    flex: 0 0 100px;
  }
</style>
