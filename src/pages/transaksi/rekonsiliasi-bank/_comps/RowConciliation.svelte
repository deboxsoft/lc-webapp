<script lang="ts">
  import type { BankReconciliation } from "@deboxsoft/accounting-api";
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import { convertToRp } from "__@root/utils";
  import { getAccountContext, getReconciliationContext } from "__@modules/accounting";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  const {removeBankReconciliation} = getReconciliationContext();
  export let bankReconciliation: BankReconciliation;

  // export let index: number;
  const { getAccount } = getAccountContext();
  const account = getAccount(bankReconciliation.accountId);
  let dropdownTriggerElement;

  async function removeHandler() {
    try {
        await removeBankReconciliation(bankReconciliation.id);
    } catch (e) {

    }
  }
</script>

<tr>
  <td class="d-table-cell">{bankReconciliation.bank || ''}</td>
  <td class="d-none d-lg-table-cell">{bankReconciliation.accountBank || ''}</td>
  <td class="d-none d-xl-table-cell">
    <CellAccount account={$account} />
  </td>
  <td class="text-right">{convertToRp(bankReconciliation.balance)}</td>
  <!--  TODO saldo account -->
  <td class="text-right">{convertToRp('1000')}</td>
  <td class="text-center">
    <span
      class="badge"
      class:badge-danger={bankReconciliation.status !== 'RECONCILED'}
      class:badge-success={bankReconciliation.status === 'RECONCILED'}>{bankReconciliation.status || 'UNRECONCILED'}</span>
  </td>
  <td>
    <div class="list-icons">
      <Dropdown menuClass="dropdown-menu-right" triggerElement={dropdownTriggerElement} placement="bottom-end">
        <a
          href="/#"
          bind:this={dropdownTriggerElement}
          on:click|preventDefault={() => {}}
          class="list-icons-item dropdown-toggle align-items-center caret-0"
          target="_self">
          <i class="icon-menu7" />
        </a>
        <div slot="dropdown-menu">
          <a href={$url('./:id', { id: bankReconciliation.id })} class="dropdown-item"><i
              class="icon-import" />Rekonsiliasi</a>
          <a href={$url('./:id/update', { id: bankReconciliation.id })} class="dropdown-item"><i
              class="icon-pencil7" />Ubah</a>
          <button type="button" class="dropdown-item" on:click={removeHandler}><i class="icon-trash" />Hapus</button>
        </div>
      </Dropdown>
    </div>
  </td>
</tr>
