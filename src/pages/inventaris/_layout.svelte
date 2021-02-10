<!--routify:options title="Inventaris"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "inventaris" });
</script>

<slot />
