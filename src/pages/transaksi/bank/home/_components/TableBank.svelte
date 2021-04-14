<script lang="ts">
  import RowBank from "./RowBank.svelte";
  import { getReconciliationContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";

  const { bankReconciliationStore } = getReconciliationContext();
</script>

<Table items={$bankReconciliationStore} let:item>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell">Bank</div>
      <div class="dbx-cell">Akun Bank</div>
      <div class="dbx-cell">Akun Perkiraan</div>
      <div class="dbx-cell">Saldo Bank</div>
      <div class="dbx-cell" >Saldo Akun</div>
      <div class="dbx-cell text-center" >Status</div>
      <div class="dbx-cell text-center" style="width: 30px;">#</div>
    </div>
  <div class="dbx-tbody">
    {#each $bankReconciliationStore as bankReconciliation}
      <RowBank {bankReconciliation} />
    {/each}
  </div>
</Table>
