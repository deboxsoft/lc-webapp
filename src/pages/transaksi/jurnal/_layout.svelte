<!--routify:options title="Jurnal Umum"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";
  import { createTransactionContext, getTransactionContext } from "__@modules/accounting";
  import { tick } from "svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  createTransactionContext();
  const { transactionStore, fetchTransaction } = getTransactionContext();
  let loading = true;
  fetchTransaction().then(() => {
    tick().then(() => {
      loading = false;
    })
  });
</script>
<slot />
