<script>
  import CellNumber from "__@comps/CellNumber.svelte";

  export let product;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama Barang</dt>
  <p class="col-sm-9">
    : {product.name || "-"}
  </p>
  <dt class="col-sm-3">Jumlah Barang</dt>
  <p class="col-sm-9">
    : {product.quantity || "-"}
  </p>
  <dt class="col-sm-3">Harga Satuan Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={product.price} /></span>
  </p>
  <dt class="col-sm-3">Harga Total Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={product.quantity * product.price} /></span>
  </p>
</dl>
