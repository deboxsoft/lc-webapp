<!--routify:options title="Laporan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createTransactionContext } from "__@modules/transaksi";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  createTransactionContext();
  setBreadcrumbContext({ path: $url("./"), title: "transaksi" });
</script>

<slot />
