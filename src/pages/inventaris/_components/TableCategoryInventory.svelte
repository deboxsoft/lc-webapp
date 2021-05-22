<script lang="ts">
  import { getInventoryContext } from "__@modules/accounting";
  import AccountCell from "__@comps/account/CellAccount.svelte";

  const { categoryInventoryStore } = getInventoryContext();
</script>

<table class="table table-hover text-nowrap">
  <thead>
    <tr role="row">
      <th class="d-table-cell">Nama</th>
      <th class="text-center">Umur Aset</th>
      <th class="text-center">Akun Aset</th>
      <th class="text-center">Akun Akumulasi Depresiasi</th>
      <th class="text-center">Akun Beban Depresiasi</th>
      <th class="text-center" style="width: 30px;" />
    </tr>
  </thead>
  <tbody>
    {#each $categoryInventoryStore as categoryInventory}
      <tr>
        <td>{categoryInventory.name || ""}</td>
        <td>{categoryInventory.estimatedLife || ""}</td>
        <td>
          <AccountCell id={categoryInventory.assetAccount} />
        <td>
          <AccountCell id={categoryInventory.accumulatedDepreciationAccount} />
        </td>
        <td>
          <AccountCell id={categoryInventory.depreciationAccount} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
