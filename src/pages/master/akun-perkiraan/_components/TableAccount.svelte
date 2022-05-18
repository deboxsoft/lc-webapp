<script>
  import Table from "__@comps/Table.svelte";
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { constantCase } from "@deboxsoft/module-core";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import MenuListAccount from "./MenuListAccount.svelte";
  import { getAccountType } from "__@root/utils";

  const { preferenceStore } = stores.getPreferenceAccountingContext();
  export let accounts = [];
  function createUpdateHandler(id) {
    return () => {
      $goto("./:id/update", { id });
    };
  }

  function createRemoveHandler(id) {
    return () => {
      $goto("./:id/remove", { id });
    };
  }

  function haveChildren(accountId) {
    const i = accounts.findIndex((_) => _.parentId === accountId);
    return i > -1;
  }
</script>

<Table items={accounts} let:item={account}>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell kode">Kode</div>
    <div class="dbx-cell">Nama</div>
    <div class="dbx-cell parent">Induk</div>
    <div class="dbx-cell type">Klasifikasi</div>
    <div class="dbx-cell -menu-list" />
  </div>
  <div class="dbx-tr">
    <div class="dbx-cell kode">{account.id || ""}</div>
    <div class="dbx-cell">{account.name || ""}</div>
    <div class="dbx-cell parent">
      <AccountCell id={account.parentId} />
    </div>
    <div class="dbx-cell type">
      {constantCase(getAccountType(account, $preferenceStore), { delimiter: " " })}
    </div>
    <div class="dbx-cell -menu-list">
      <MenuListAccount id={account.id} removeActDisable={haveChildren(account.id)} />
    </div>
  </div>
</Table>

<style lang="scss">
  .kode {
    flex: 0 0 80px;
  }

  .parent {
    flex: 0 0 300px;
  }

  .type {
    flex: 0 0 120px;
  }
</style>
