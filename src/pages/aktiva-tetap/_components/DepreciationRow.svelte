<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { dayjs } from "@deboxsoft/accounting-api";

  export let depreciation = {};
  let month = depreciation.month;
  if (month) {
    const _monthNumber = Number.parseInt(month.substring(4));
    const _yearNumber = Number.parseInt(month.substring(0, 4));
    month = dayjs(new Date(_yearNumber, _monthNumber)).format("MMMM YYYY");
  }
</script>

<tr>
  <td>{month || ""}</td>
  <td><CellNumber value={depreciation.amount} /></td>
</tr>
