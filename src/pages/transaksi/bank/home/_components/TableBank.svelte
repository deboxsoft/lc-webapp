<script lang="ts">
  import { getBankContext, getAccountContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import BalanceAccount from "__@comps/account/BalanceAccount.svelte";
  import MenuListBank from "./MenuListBank.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { bankStore, find } = getBankContext();
  const { getAccount } = getAccountContext();
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
      <div class="dbx-cell d-sm-none d-xl-flex account">No Rekening</div>
      <div class="dbx-cell d-sm-none d-xl-flex name">Nama Rekening</div>
      <div class="dbx-cell">Akun Perkiraan</div>
      <div class="dbx-cell d-sm-none d-md-flex balance">Saldo Bank</div>
      <div class="dbx-cell d-sm-none d-md-flex balance">Saldo Akun Perkiraan</div>
      <div class="dbx-cell balance">Selisih</div>
      <div class="dbx-cell -menu-list" />
    </div>
    <div class="dbx-tr">
      <div class="dbx-cell bank flex-column">
        {bank.name || ""}
        {bank.branch ? `cabang ${bank.branch}` : ""}
      </div>
      <div class="dbx-cell d-sm-none d-xl-flex account">{bank.noAccountBank || ""}</div>
      <div class="dbx-cell d-sm-none d-xl-flex name">{bank.nameAccountBank || ""}</div>
      <div class="dbx-cell">
        <CellAccount id={bank.accountId} />
      </div>
      <div class="dbx-cell d-sm-none d-md-block text-right balance">
        <CellRp value={bank.balance} />
      </div>
      <div class="dbx-cell d-sm-none d-md-block text-right balance">
        <BalanceAccount id={bank.accountId} />
      </div>
      <div class="dbx-cell text-right balance">
        <BalanceAccount id={bank.accountId} value={(_value) => parseFloat(bank.balance) - _value} />
      </div>
      <div class="dbx-cell -menu-list" style="width: 30px">
        <MenuListBank id={bank.id} />
      </div>
    </div>
  </Table>
{/if}

<style lang="scss">
  .bank {
    flex: 0 0 250px;
  }

  .account {
    flex: 0 0 100px;
  }

  .name {
    flex: 0 0 250px;
  }

  .balance {
    flex: 0 0 150px;
  }
</style>
