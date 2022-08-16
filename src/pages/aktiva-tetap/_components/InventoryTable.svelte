<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import InventoryRow from "./InventoryRow.svelte";

  export let inventoryStore;
  const classes = {
    id: "",
    datePurchase: "d-none d-lg-table-cell",
    name: "",
    category: "d-none d-lg-table-cell",
    depreciationAccumulation: "d-none",
    bookValue: "d-none d-lg-table-cell",
    quantity: "",
    priceItem: "",
    total: "",
    status: ""
  };
</script>

<Table class="table-hover">
  <tr slot="header">
    <th class={classes.id} width="90" style="text-align: center">No</th>
    <th class={classes.datePurchase} width="100" style="text-align: center">Tanggal Perolehan</th>
    <th class={classes.name}>Nama Asset</th>
    <th class={classes.category} width="100">Kategori</th>
    <th class={classes.bookValue} width="160" style="text-align: center">Nilai Buku</th>
    <th class={classes.quantity} width="50" style="text-align: center">Jumlah</th>
    <th class={classes.priceItem} width="160" style="text-align: center">Harga Satuan</th>
    <th class={classes.total} width="160" style="text-align: center">Harga Total</th>
    <th width="30" />
  </tr>
  {#each $inventoryStore as inventory (inventory.id)}
    <InventoryRow {inventory} />
  {/each}
</Table>
