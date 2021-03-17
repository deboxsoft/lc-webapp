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

  $: console.log(generalLedger.oppositeAccountId);

</script>

<tr class={classes}>
  <td class="control d-table-cell">{generalLedger.no || ''}</td>
  <td class="d-none d-lg-table-cell">{lightFormat(parse(generalLedger.date, 'T', new Date()), 'dd-MM-yyyy') || ''}</td>
  <td class="d-none d-xl-table-cell">
    <CellAccount id={generalLedger.oppositeAccountId} />
  </td>
  <td>{generalLedger.description || ""}</td>
  <td>
    <CellRp value={generalLedger.amount} />
  </td>
</tr>
