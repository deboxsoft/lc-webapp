<!--routify:options title="Bdd"-->
<script>
  import { onMount } from "svelte";
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createAclContext } from "__@root/utils";

  const { readGranted, createGranted } = createAclContext({
    resource: "bdd"
  });
  const applicationContext = getApplicationContext();
  const { subscribe } = stores.createBddContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "BDD" });

  onMount(() => {
    return subscribe();
  });
</script>

<slot />
