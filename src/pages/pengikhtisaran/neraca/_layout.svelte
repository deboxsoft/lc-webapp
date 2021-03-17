<!--routify:options title="Neraca"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createGeneralLedgerContext } from "__@modules/accounting";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "neraca" });
  createGeneralLedgerContext();
</script>
<slot />
