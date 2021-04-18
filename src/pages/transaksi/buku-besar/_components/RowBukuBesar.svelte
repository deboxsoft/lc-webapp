<script lang="ts">
  import { goto } from "@roxi/routify";
  import { lightFormat, parse } from "date-fns";
  import CellRp from "__@comps/CellRp.svelte";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getAccountContext} from "__@modules/accounting";

  const { accountStore } = getAccountContext();

  export let generalLedger: GeneralLedger;
  export let style: string = "";
  $: classes = clsx("dbx-tr");
</script>

<div class={classes} {style}>
  <div class="dbx-cell text-center" style="width: 200px">
    {lightFormat(parse(generalLedger.date, "T", new Date()), "dd-M-yyyy") || ""}
  </div>
  <div class="dbx-cell text-center" style="width: 250px">
    <a
      href="/#"
      on:click|preventDefault={() =>
        $goto("/transaksi/jurnal/:id/view", { id: generalLedger.transactionId, backUrl: "/transaksi/buku-besar" }, true, true)}
      target="_self"
    >
      {generalLedger.transactionId}
    </a>
  </div>
  <td class="dbx-cell">
    {generalLedger.description || ""}
  </td>
  <div class="dbx-cell" style="width: 400px">
    <CellRp spaceMinus value={generalLedger.amount} />
  </div>
  <div class="dbx-cell" style="width: 350px">
    <CellRp value={generalLedger.balance} />
  </div>
</div>
