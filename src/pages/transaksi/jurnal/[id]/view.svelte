<script>
  import { params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { writable } from "svelte/store";
  import { getAclContext } from "../_acl-context";
  import DetailTransaction from "../_tables/DetailTransaction.svelte";
  import { tick } from "svelte";

  const { approveGranted, rejectGranted } = getAclContext();
  const context = stores.getTransactionContext();
  let backUrl = $params.backUrl || "../";

  let transaction = writable({});
  let isMounted = false;
  let approved, rejected, unapproved, approveButtonEnable, rejectButtonEnable;
  $: {
    if ($params.id) {
      transaction = context.getTransaction($params.id);
      tick().then(() => {
        if ($transaction) {
          approved = $transaction.status === "APPROVED";
          rejected = $transaction.status === "REJECTED";
          unapproved = $transaction.status === "UNAPPROVED";
          approveButtonEnable = approveGranted && unapproved;
          rejectButtonEnable = rejectGranted && unapproved;
        }
      })
    }
  }
</script>

<DetailTransaction {approveButtonEnable} {rejectButtonEnable} {backUrl} transaction={$transaction} />
