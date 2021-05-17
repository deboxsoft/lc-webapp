<!--routify:options title="BDD"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";
  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "bdd" });

</script>
<slot />
