<script>
  import CellNumber from "../../../../components/CellNumber.svelte";

  export let stock;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama Barang</dt>
  <p class="col-sm-9">
    : {stock.name || "-"}
  </p>
  <dt class="col-sm-3">Jumlah Barang</dt>
  <p class="col-sm-9">
    : {stock.quantity || "-"}
  </p>
  <dt class="col-sm-3">Harga Satuan Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={stock.price} /></span>
  </p>
  <dt class="col-sm-3">Harga Total Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={stock.quantity * stock.price} /></span>
  </p>
</dl>
