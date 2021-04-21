<script>
  import { format, parse } from "date-fns";
  import InlineCheckBox from "__@comps/InlineCheckBox.svelte";
  import { get, writable } from "svelte/store";
  import { getBankStatementContext, getAccountContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import MenuListStatement from "../MenuListStatement.svelte";

  const { bank } = getBankStatementContext();
  const { getAccount } = getAccountContext();
  export let bankStatementList = undefined;
  export let preview = false;
  export let loading;
  export let errors = [];
  export let itemsSelected = writable([]);
  let isSelectAll = preview;

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
          _tmp.push(index)
        }
      })
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

{#if $bank}
  <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
    <dl class="row mb-0">
      <dt class="col-sm-3 mb-0">Nama bank</dt>
      <p class="col-sm-9 mb-0">
        : <span class="font-weight-bold text-uppercase">{$bank.name}</span>
        {$bank.cabang ? `cabang ${$bank.branch}` : ""}
      </p>
      <dt class="col-sm-3 mb-0">No Rekening</dt>
      <p class="col-sm-9 mb-0">: {$bank.noAccountBank}</p>
      <dt class="col-sm-3 mb-0">An. Rekening</dt>
      <p class="col-sm-9 mb-0">: {$bank.nameAccountBank}</p>
      <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
      <p class="col-sm-9 mb-0">: {get(getAccount($bank.accountId))?.name || ""}</p>
    </dl>
  </div>
{/if}
{#if loading}
  <Loader />
{:else}
  <Table>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell check-item">
        <InlineCheckBox checked={isSelectAll} on:change={toggleSelectedAllHandler} />
      </div>
      <div class="dbx-cell text-center date">Tanggal</div>
      <div class="dbx-cell d-sm-none d-md-flex">Diskripsi</div>
      <div class="dbx-cell d-sm-none d-md-none d-xl-flex amount">Masuk</div>
      <div class="dbx-cell d-sm-none d-md-none d-xl-flex amount">Keluar</div>
      <div class="dbx-cell amount">Saldo</div>
      <div class="dbx-cell account" class:preview>Account</div>
      {#if !preview}
        <div class="dbx-cell text-center status">Status</div>
        <div class="dbx-cell -menu-list" />
      {/if}
    </div>
    {#each bankStatementList as bankStatement, index}
      <div class="dbx-tr {errors.includes(index) && `error`}" class:preview>
        <div class="dbx-cell check-item">
          <InlineCheckBox
            disabled={bankStatement.status === "RECONCILED"}
            checked={$itemsSelected.includes(index)}
            on:change={createCheckSelectHandler(index)}
          />
        </div>
        <div class="dbx-cell text-center date">
          {!preview ? format(parse(bankStatement.date, "T", new Date()), "dd-MM-yy") : bankStatement.date || ""}
        </div>
        <div class="dbx-cell d-sm-none d-md-flex">{bankStatement.description || ""}</div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.in} /></div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.out} /></div>
        <div class="dbx-cell text-right amount"><CellRp value={bankStatement.balance} /></div>
        <div class="dbx-cell account" class:preview>
          {#if preview}
            <AccountSelect allowEmpty bind:accountId={bankStatement.accountId} />
          {:else}
            <AccountCell id={bankStatement.accountId} />
          {/if}
        </div>
        {#if !preview}
          <div class="dbx-cell text-center status">
            <a href="/#" on:click|preventDefault={() => {}} target="_self">
              <span
                class="badge"
                class:badge-success={bankStatement.status === "RECONCILED"}
                class:badge-danger={bankStatement.status !== "RECONCILED"}>{bankStatement.status || "UNRECONCILED"}</span
              >
            </a>
          </div>
          <div class="dbx-cell -menu-list" style="width: 30px">
            <MenuListStatement id={bankStatement.id} />
          </div>
        {/if}
      </div>
    {/each}
  </Table>
{/if}

<style lang="scss">
  .dbx-tr.preview {
    height: 45px;
    .dbx-cell {
      line-height: 40px;
    }
  }
  .check-item {
    flex: 0 0 30px;
  }
  .date {
    flex: 0 0 100px;
  }

  .amount {
    flex: 0 0 200px;
  }

  .account {
    flex: 0 0 150px;
    &.preview {
      overflow: unset;
      flex: 0 0 250px;
      height: 37px;
    }
  }
  .status {
    flex: 0 0 100px;
  }
</style>
