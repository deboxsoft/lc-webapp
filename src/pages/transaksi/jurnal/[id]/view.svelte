<script>
  import { params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { writable } from "svelte/store";
  import DetailTransaction from "../_tables/DetailTransaction.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { transactionService } = getApplicationContext();
  const context = stores.getTransactionContext();
  let backUrl = $params.backUrl || "../";

  let transaction = writable(undefined);
  let isMounted = false;
  $: {
    if ($params.id) {
      if (context) {
        transaction = context.getTransaction($params.id);
      } else if (transactionService) {
        const { findById } = transactionService;
        findById($params.id).then((_) => {
          transaction = _;
        });
      }
    }
  }
</script>

<DetailTransaction {backUrl} transaction={$transaction} />
