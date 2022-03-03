<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import BddRow from "./BddRow.svelte";

  export let bddStore;
  export let onSelect = undefined;
  const classes = {
    id: "",
    dateStart: "d-none d-lg-table-cell",
    name: "",
    monthLife: "d-none d-lg-table-cell",
    status: "d-none d-md-table-cell",
    category: "d-none d-lg-table-cell",
    taxRate: "d-none d-md-table-cell",
    accumulation: "d-none",
    bookValue: "d-none d-lg-table-cell",
    amount: "d-none",
    total: ""
  };

  function createClickHandler(bdd) {
    return () => {
      onSelect && onSelect(bdd);
    };
  }
</script>

<Table class="table-hover">
  <tr slot="header">
    <th class={classes.id} width="80" style="text-align: center"> No </th>
    <th class={classes.dateStart} width="100" style="text-align: center">Tanggal Awal</th>
    <th class={classes.name}>Nama</th>
    <th class={classes.monthLife} width="80" style="text-align: center">Umur (Bulan)</th>
    <th class={classes.category} width="100" style="text-align: center">Jenis</th>
    <th class={classes.taxRate} width="70" style="text-align: center">Pajak (%)</th>
    <th class={classes.accumulation} width="160" style="text-align: center">Akum. Amortization</th>
    <th class={classes.bookValue} width="160" style="text-align: center">Nilai Buku</th>
    <th class={classes.amount} width="160" style="text-align: center">Harga</th>
    <th class={classes.total} width="160" style="text-align: center">Harga Total</th>
    <th class={classes.status} width="50" style="text-align: center">Status</th>
    <th width="30" />
  </tr>
  {#each $bddStore as bdd (bdd.id)}
    <BddRow {bdd} {classes} on:click={createClickHandler(bdd)} />
  {/each}
</Table>
<slot />
