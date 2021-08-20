<script>
  import { stores } from "@deboxsoft/accounting-client";
  import CellRp from "../../../components/CellRp.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();
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
