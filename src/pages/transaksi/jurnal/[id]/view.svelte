<script>
  import { params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { writable } from "svelte/store";
  import DetailTransaction from "../_tables/DetailTransaction.svelte";

  const context = stores.getTransactionContext();
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
