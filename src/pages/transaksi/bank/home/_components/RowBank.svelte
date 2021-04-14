<script lang="ts">
  import type { BankReconciliation } from "@deboxsoft/accounting-api";

  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext, getReconciliationContext } from "__@modules/accounting";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuList from "./MenuListBank.svelte";

  const { remove } = getReconciliationContext();
  export let bankReconciliation: BankReconciliation;
  export let style: string = "";

  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(bankReconciliation.accountId);
  $: classes = clsx("dbx-tr");


  async function removeHandler() {
    try {
      await remove(bankReconciliation.id);
    } catch (e) {
    }
  }
</script>

<div class={classes} {style}>
  <div class="dbx-cell">{bankReconciliation.bank || ''}</div>
  <div class="dbx-cell">{bankReconciliation.accountBank || ''}</div>
  <div class="dbx-cell">
    <CellAccount {account} />
  </div>
  <div class="dbx-cell text-right">{convertToRp(bankReconciliation.balance)}</div>
  <!--  TODO saldo account -->
  <div class="dbx-cell text-right">{convertToRp('1000')}</div>
  <div class="dbx-cell text-center">
    <span
      class="badge"
      class:badge-danger={bankReconciliation.status !== 'RECONCILED'}
      class:badge-success={bankReconciliation.status === 'RECONCILED'}>{bankReconciliation.status || 'UNRECONCILED'}</span>
  </div>
  <div class="dbx-cell -menu-list" style="width: 30px">
    <MenuList id={bankReconciliation.id} />
  </div>
</div>
