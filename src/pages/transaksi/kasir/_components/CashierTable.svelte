<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CashierRow from "./CashierRow.svelte";

  export let cashierStore;
  export let onSelect = undefined;
  const classes = {
    no: "d-none d-lg-table-cell",
    date: "d-none d-md-table-cell",
    program: "d-none d-lg-table-cell",
    studentName: "d-none d-lg-table-cell",
    description: "",
    status: "d-none d-md-table-cell",
    amount: ""
  };
</script>

<Table class="table-hover">
  <tr slot="header">
    <th class={classes.no} width="100">No Kwitansi</th>
    <th class={classes.date} width="100">Tanggal</th>
    <th class={classes.program} width="200">Program</th>
    <th class={classes.studentName} width="200">Nama Siswa</th>
    <th class={classes.description}>Keterangan</th>
    <th class={classes.status} width="100">Status</th>
    <th class={classes.amount} width="170">Nominal</th>
    <th width="30" />
  </tr>
  {#each $cashierStore as cashier (cashier.id)}
    <CashierRow {classes} {cashier} />
  {/each}
</Table>
<slot />
