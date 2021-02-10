<!--routify:options title="Rekonsiliasi Bank"-->
<script lang="ts">
  import { createReconciliationContext } from "__@modules/accounting";
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "rekonsiliasi bank" });
  createReconciliationContext()
</script>
<slot />
