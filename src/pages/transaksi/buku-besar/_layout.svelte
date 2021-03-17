<!--routify:options title="Buku Besar"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "buku-besar" });
</script>
<slot />
