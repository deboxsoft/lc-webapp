<script lang="ts">
  import { stores } from "@deboxsoft/accounting-client";
  import Table from "__@comps/Table.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import BalanceAccount from "__@comps/account/BalanceAccount.svelte";
  import MenuListBank from "./MenuListBank.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { bankStore, find } = stores.getBankContext();
  const { getAccount } = stores.getAccountContext();
  let loading = true;
  find().then(() => {
    loading = false;
  });
</script>

{#if loading}
  <Loader />
{:else}
  <Table items={$bankStore} let:item={bank}>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell bank">Bank</div>
      <div class="dbx-cell d-sm-none d-xl-flex name">Rekening</div>
      <div class="dbx-cell">Akun Perkiraan</div>
      <div class="dbx-cell d-sm-none d-md-flex balance">Saldo Bank</div>
      <div class="dbx-cell d-sm-none d-md-flex balance">Saldo Akun Perkiraan</div>
      <div class="dbx-cell balance">Selisih</div>
      <div class="dbx-cell -menu-list" />
    </div>
    <div class="dbx-tr">
      <div class="dbx-cell bank flex-column">
        <div>
          <div class="text-default font-weight-semibold">
            {bank.name || ""}
          </div>
          <div class="text-muted font-size-sm">
            {bank.branch ? `cabang ${bank.branch}` : ""}
          </div>
        </div>
      </div>
      <div class="dbx-cell d-sm-none d-xl-flex name">
        <div>
          <div class="text-default font-weight-semibold">
            {bank.nameAccountBank || ""}
          </div>
          <div class="text-muted font-size-sm">
            {bank.noAccountBank || ""}
          </div>
        </div>
      </div>
      <div class="dbx-cell">
        <div>
          <div class="text-default font-weight-semibold">
            <CellAccount id={bank.accountId} />
          </div>
          <div class="text-muted font-size-sm">
            {bank.accountId}
          </div>
        </div>
      </div>
      <div class="dbx-cell d-sm-none d-md-flex text-right balance">
        <CellRp class="flex-1 align-items-center" value={bank.balance} />
      </div>

      <div class="dbx-cell d-sm-none d-md-flex text-right balance">
        <BalanceAccount class="flex-1 align-items-center" id={bank.accountId} />
      </div>
      <div class="dbx-cell d-flex text-right balance">
        <BalanceAccount class="flex-1 align-items-center" id={bank.accountId} value={(_value) => parseFloat(bank.balance) - _value} />
      </div>
      <div class="dbx-cell -menu-list d-flex align-items-center" style="width: 30px">
        <MenuListBank id={bank.id} />
      </div>
    </div></Table
  >
{/if}

<style lang="scss">
  .dbx-tr {
    height: 50px;
  }

  .bank {
    flex: 0 0 150px;
  }

  .account {
    flex: 0 0 100px;
  }

  .name {
    flex: 0 0 150px;
  }

  .balance {
    flex: 0 0 150px;
  }
</style>
