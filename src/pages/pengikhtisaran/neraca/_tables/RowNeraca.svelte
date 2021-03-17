<script lang="ts">
  import type { ItemSaldo } from "__@root/utils";

  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import CellRp from "__@comps/CellRp.svelte";

  export let itemSaldo: ItemSaldo;
  let classes = "";
  $: classes = clsx("odd");
</script>

<tr class={classes}>
  <td class="d-none d-xl-table-cell">{itemSaldo.name}</td>
  <td class="text-right">
    <CellRp value={itemSaldo.amount} />
  </td>
  <td style="width: 200px">&nbsp;</td>
</tr>
