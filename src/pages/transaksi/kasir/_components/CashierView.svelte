<script>
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import CellNumber from "../../../../components/CellNumber.svelte";
  import CellAccount from "../../../../components/account/CellAccount.svelte";

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
    : {dayjs(inventory.date).format("DD-MMM-YY") || "-"}
  </p>
  <dt class="col-sm-3">Kategori</dt>
  <p class="col-sm-9">
    : {getCategoryInventory(inventory.categoryId)?.name || "-"}
  </p>
  <dt class="col-sm-3">Akun Kredit</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={inventory.creditAccount} />
  </p>
  <dt class="col-sm-3">Harga Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={inventory.priceItem} /></span>
  </p>
  <dt class="col-sm-3">Jumlah Barang</dt>
  <p class="col-sm-9">
    : {inventory.quantity || "-"}
  </p>
  <dt class="col-sm-3">Harga Total Barang</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellNumber class="ml-1" value={inventory.quantity * inventory.priceItem} /></span>
  </p>
</dl>
