<script>
  import { get } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";
  import CellRp from "__@comps/CellRp.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();
  export let inventory;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {inventory.name || "-"}
  </p>
  <dt class="col-sm-3">Tanggal Pembelian</dt>
  <p class="col-sm-9">
    : { format(parse(inventory.purchaseDate, "T", new Date()))}
  </p>
  <dt class="col-sm-3">Kategori</dt>
  <p class="col-sm-9">
    : {get(getCategoryInventory(inventory.categoryId)?.name) || "-"}
  </p>
  <dt class="col-sm-3">Depresiasi Awal</dt>
  <p class="col-sm-9">
    : {inventory.earlyDepreciation || "-"}
  </p>
  <dt class="col-sm-3">Harga Barang</dt>
  <p class="col-sm-9">
    : <CellRp value={inventory.priceItem} />
  </p>
  <dt class="col-sm-3">Jumlah Barang</dt>
  <p class="col-sm-9">
    : {inventory.quantity || "-"}
  </p>
  <dt class="col-sm-3">Harga Total Barang</dt>
  <p class="col-sm-9">
    : <CellRp value={inventory.quantity * inventory.priceItem} />
  </p>
</dl>
