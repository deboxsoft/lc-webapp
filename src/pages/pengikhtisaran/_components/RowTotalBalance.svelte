<script>
  import CellRp from "__@comps/CellRp.svelte";

  export let label;
  export let balance;
</script>

<tr class="table-active table-border-double">
  <td>{label}</td>
  <td>&nbsp;</td>
  <td class="d-sm-table-cell d-xl-none">&nbsp;</td>
  <td class="text-right" style="width: 200px">
    <CellRp value={balance} />
  </td>
  <td class="d-xl-table-cell d-none">&nbsp;</td>
</tr>