<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore, BREADCRUMB_CONTEXT } from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "akun-perkiraan" });

</script>
<slot />
