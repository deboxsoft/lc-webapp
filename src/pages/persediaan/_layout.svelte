<!--routify:options title="Persediaan"-->
<script>
  import { onMount } from "svelte";
  import { goto, url } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "__@comps/loader/Loader.svelte";
  import { createAclContext } from "__@root/utils";

  const { readGranted } = createAclContext({
    resource: "stock"
  });
  const applicationContext = getApplicationContext();
  const stockContext = stores.createStockContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "persediaan" });
  let booting = true;
  stockContext.fetch().then(() => {
    booting = false;
  });

  onMount(() => {
    return stockContext.subscribe();
  });
</script>

{#if booting}
  <Loader />
{:else}
  <slot />
{/if}
