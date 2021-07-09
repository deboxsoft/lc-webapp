<script>
  import dayjs from "dayjs";
  import { writable } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/Table.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { bank } = stores.getBankStatementContext();
  const { getAccount, getAccountLeaf } = stores.getAccountContext();
  export let bankStatementList = undefined;
  export let preview = false;
  export let loading;
  export let errors = [];
  export let itemsSelected = writable([]);
  let isSelectAll = preview;

  $: accountChildren = getAccountLeaf();

  $: {
    if (preview && bankStatementList) {
      checkSelectAll();
    }
  }

  function checkSelectAll() {
    if (isSelectAll) {
      let _tmp = [];
      bankStatementList.forEach((_, index) => {
        if (_.status !== "RECONCILED") {
          _tmp.push(index);
        }
      });
      itemsSelected.set(_tmp);
    } else {
      itemsSelected.set([]);
    }
  }

  function toggleSelectedAllHandler() {
    isSelectAll = !isSelectAll;
    checkSelectAll();
  }

  function createCheckSelectHandler(index) {
    return () => {
      if ($itemsSelected.includes(index)) {
        $itemsSelected = [...$itemsSelected.filter((_) => _ !== index)];
      } else {
        $itemsSelected = [...$itemsSelected, index];
      }
    };
  }
</script>

{#if loading}
  <Loader />
{:else}
  <Table>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell text-center date">Tanggal</div>
      <div class="dbx-cell">Diskripsi</div>
      <div class="dbx-cell d-sm-none d-md-none d-xl-flex amount">Masuk</div>
      <div class="dbx-cell d-sm-none d-md-none d-xl-flex amount">Keluar</div>
      <div class="dbx-cell amount">Saldo</div>
      <div class="dbx-cell account">Account</div>
    </div>
    {#each bankStatementList as bankStatement, index}
      <div class="dbx-tr {errors.includes(index) && `error`}" class:preview>
        <div class="dbx-cell text-center date">
          {dayjs(bankStatement.date).format("DD-MMM-YYYY") || ""}
        </div>
        <div class="dbx-cell">{bankStatement.description || ""}</div>
        <div class="dbx-cell text-right d-sm-none d-md-none d-xl-flex amount"><CellRp value={bankStatement.in} /></div>
        <div class="dbx-cell text-right d-sm-none d-md-none d-xl-flex amount"><CellRp value={bankStatement.out} /></div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.balance} /></div>
        <div class="dbx-cell account d-inline-flex align-items-center">
          <div>
            <div>
              <AccountCell id={bankStatement.accountId} />
            </div>
            <div class="text-muted" style="font-size: 0.8em">
              {bankStatement.accountId || ""}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </Table>
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
