<script>
  import CellNumber from "__@comps/CellNumber.svelte";

  /** @type {import("@deboxsoft/accounting-api").Amortization}*/
  export let amortization;
</script>

<tr>
  <td>{amortization.month}</td>
  <td><CellNumber value={amortization.amount} />
  </td>
  <td style="cursor: pointer; padding: 0">
  </td>
</tr>
