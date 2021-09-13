<script>
  import CellNumber from "../../../components/CellNumber.svelte";

  export let label;
  export let balance;
</script>

<tr class="table-active table-border-double">
  <td colspan="2">{label}</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td class="text-right" style="width: 200px">
    <CellNumber value={balance} />
  </td>
</tr>