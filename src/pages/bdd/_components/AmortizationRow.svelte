<script>
  import CellRp from "../../../components/CellRp.svelte";

  /** @type {import("@deboxsoft/accounting-api").Amortization}*/
  export let amortization;
</script>

<tr>
  <td>{amortization.month}</td>
  <td><CellRp value={amortization.amount} />
  </td>
  <td style="cursor: pointer; padding: 0">
  </td>
</tr>
