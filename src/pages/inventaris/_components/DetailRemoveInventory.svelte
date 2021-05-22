<script>
  import { getInventoryContext } from "__@modules/accounting";
  import CellRp from "__@comps/CellRp.svelte";

  const { getCategoryInventory } = getInventoryContext();
  export let inventory;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {inventory.name || "-"}
  </p>
  <dt class="col-sm-3">Jumlah Akumulasi Depresiasi</dt>
  <p class="col-sm-9">
    : <CellRp value={0} />
  </p>
</dl>
