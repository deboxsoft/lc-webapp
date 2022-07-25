<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { constantCase } from "@deboxsoft/module-core";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import MenuListAccount from "./MenuListAccount.svelte";
  import { getAccountType } from "__@root/utils";
  import CellNumber from "__@comps/CellNumber.svelte";

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

  function createClickHandler(account) {
    return () => {
      $goto("./:id/view", { id: account.id });
    };
  }

  const classes = {
    id: "",
    name: "",
    parent: "d-none d-sm-table-cell",
    type: "d-none d-md-table-cell",
    startBalance: "d-none d-md-table-cell"
  };
</script>

<Table class="table-hover" items={accounts} let:item={account}>
  <tr slot="header">
    <th class={classes.id} width="80">Kode</th>
    <th class={classes.name}>Nama</th>
    <th class={classes.parent} width="200">Induk</th>
    <th class={classes.type} width="100">Klasifikasi</th>
    <th class={classes.startBalance} width="160">Saldo Awal</th>
    <th width="30" />
  </tr>
  <tr class="cursor-pointer">
    <td class={classes.id} on:click={createClickHandler(account)}>{account.id || ""}</td>
    <td class={classes.name} on:click={createClickHandler(account)}>{account.name || ""}</td>
    <td class={classes.parent} on:click={createClickHandler(account)}>
      <AccountCell id={account.parentId} />
    </td>
    <td class={classes.type} on:click={createClickHandler(account)}>
      {constantCase(getAccountType(account, $preferenceStore), { delimiter: " " })}
    </td>
    <td class={classes.startBalance} on:click={createClickHandler(account)}>
      <CellNumber value={account.startBalance} />
    </td>
    <td style="padding: 0">
      <MenuListAccount id={account.id} removeActDisable={haveChildren(account.id)} />
    </td>
  </tr>
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
