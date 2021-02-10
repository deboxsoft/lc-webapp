<!--routify:options title="Persediaan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "persediaan" });
</script>

<slot />
