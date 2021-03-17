<!--routify:options title="Laba Rugi"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";
  import { createGeneralLedgerContext } from "__@modules/accounting";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "laba-rugi" });
  createGeneralLedgerContext();

</script>
<slot />
