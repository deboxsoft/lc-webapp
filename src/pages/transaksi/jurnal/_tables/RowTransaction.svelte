<script lang="ts">
  import type { Transaction } from "@deboxsoft/accounting-api";

  import { lightFormat, parse } from "date-fns";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import CellRp from "__@comps/CellRp.svelte";
  import MenuListTransaction from "./MenuListTransaction.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccount } = getAccountContext();

  export let transaction: Transaction;
  export let style: string = "";
  let account;

  $: account = getAccount(transaction.accountId);
  $: classes = clsx("dbx-tr");
</script>


<div class={classes} {style}>
  <div class="dbx-cell text-center" style="width: 250px; font-size: 0.9em">{transaction.id || ""}</div>
  <div class="dbx-cell text-center" style="width: 200px">{lightFormat(parse(transaction.date, "T", new Date()), "dd-MM-yyyy") || ""}</div>
  <div class="dbx-cell" style="width: 350px">{$account?.name || ""}</div>
  <div class="dbx-cell flex-grow-1">{transaction.description || ""}</div>
  <div class="dbx-cell" style="width: 350px">
    <CellRp value={transaction.amount || ""} />
  </div>
  <div class="dbx-cell -menu-list" style="width: 30px">
    <MenuListTransaction {transaction} />
  </div>
</div>
