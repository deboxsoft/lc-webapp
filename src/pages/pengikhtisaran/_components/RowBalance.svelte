<script lang="ts">
  import CellRp from "__@comps/CellRp.svelte";

  export let name: string;
  export let balance: number;
</script>

<tr>
  <td class="d-none d-xl-table-cell">{name}</td>
  <td class="text-right" style="width: 200px">
    <CellRp value={balance} />
  </td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
</tr>
