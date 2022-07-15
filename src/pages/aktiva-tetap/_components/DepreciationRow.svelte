<script>
  import CellNumber from "__@comps/CellNumber.svelte";

  export let depreciation = {};
  let dropdownContext;
</script>

<tr>
  <td>{depreciation.month || ""}</td>
  <td><CellNumber value={depreciation.amount} /></td>
</tr>
