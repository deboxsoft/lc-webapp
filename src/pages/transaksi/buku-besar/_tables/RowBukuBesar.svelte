<script lang="ts">
  import { lightFormat, parse } from "date-fns";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import {getAccountContext} from "__@modules/accounting"
  
  const {accountStore} = getAccountContext()


  export let generalLedger: GeneralLedger;

  let classes = "";
  $: classes = clsx("odd");

</script>

<tr class={classes}>
  <td class=" d-lg-table-cell">{lightFormat(parse(generalLedger.date, 'T', new Date()), 'dd-MM-yyyy') || ''}</td>
  <td class="d-none d-xl-table-cell">
    {generalLedger.transactionId}
  </td>
  <td class="d-none d-xl-table-cell">
    {generalLedger.description || ""}
  </td>
  <td>
    <CellRp spaceMinus value={generalLedger.amount} />
  </td>
  <td>
    <CellRp value={generalLedger.balance} />
  </td>
</tr>
