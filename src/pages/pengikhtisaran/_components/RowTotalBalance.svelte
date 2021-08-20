<script>
  import CellRp from "../../../components/CellRp.svelte";

  export let label;
  export let balance;
</script>

<tr class="table-active table-border-double">
  <td colspan="2">{label}</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td class="text-right" style="width: 200px">
    <CellRp value={balance} />
  </td>
</tr>