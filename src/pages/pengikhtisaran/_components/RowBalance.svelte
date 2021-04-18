<script lang="ts">
  import CellRp from "__@comps/CellRp.svelte";

  export let label: string;
  export let balance: number;
</script>

<tr>
  <td class="d-xl-table-cell">{label}</td>
  <td class="d-table-cell d-xl-none">&nbsp;</td>
  <td class="d-table-cell d-md-none">&nbsp;</td>
  <td class="text-right" style="width: 200px">
    <CellRp value={balance} />
  </td>
  <td class="d-none d-md-table-cell">&nbsp;</td>
  <td class="d-none d-xl-table-cell">&nbsp;</td>
</tr>
