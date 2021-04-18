<!--routify:options title="Pengikhtisaran"-->
<script lang="ts">

  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createBalanceContext } from "__@modules/accounting";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengikhtisaran" });
  createBalanceContext();
</script>

<slot />
