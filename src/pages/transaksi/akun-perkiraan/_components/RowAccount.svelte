<script>
  import { get } from "svelte/store";
  import { getAccountContext } from "__@modules/accounting";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import MenuList from "./MenuList.svelte";

  const { getAccountType } = getAccountContext();
  export let account;
</script>

<div class="dbx-tr">
  <div class="dbx-cell text-center" style="width: 200px">{account.id || ""}</div>
  <div class="dbx-cell">{account.name || ""}</div>
  <div class="dbx-cell">{get(getAccountType(account))?.label || ""}</div>
  <div class="dbx-cell">
    <AccountCell id={account.parentId} />
  </div>
  <div class="dbx-cell -menu-list" style="width: 30px">
    <MenuList id={account.id} />
  </div>
</div>
