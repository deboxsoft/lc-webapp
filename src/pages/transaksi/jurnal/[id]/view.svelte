<script>
  import { params } from "@roxi/routify";
  import { getTransactionContext } from "__@modules/accounting";
  import { writable } from "svelte/store";
  import DetailTransaction from "../_tables/DetailTransaction.svelte";

  const context = getTransactionContext();
  let backUrl = $params.backUrl || "../";

  let transaction = writable(undefined);
  let isMounted = false;
  $: {
    if ($params.id) {
      transaction = context && context.getTransaction($params.id);
    }
  }
</script>

<DetailTransaction {backUrl} transaction={$transaction} />
