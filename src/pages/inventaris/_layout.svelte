<!--routify:options title="Inventaris"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createTransactionContext } from "__@modules/transaksi";
  import { setContext } from "svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  createTransactionContext();
  setBreadcrumbContext({ path: $url("./"), title: "inventaris" });
</script>

<slot />
