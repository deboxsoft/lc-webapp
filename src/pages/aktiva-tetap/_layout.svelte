<!--routify:options title="Aktiva Tetap"-->
<script>
  import { onMount } from "svelte";
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import { createAclContext } from "__@root/utils";

  const { readGranted } = createAclContext({
    resource: "inventory"
  });
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { findCategory, findPage, find, subscribe } = stores.createInventoryContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }

  onMount(() => {
    return subscribe();
  });

  $loading = true;
  let loaded = false;
  const inventoryPromise = findPage({ filter: {}, pageCursor: {} }, {});
  const categoryPromise = findCategory();
  Promise.all([inventoryPromise, categoryPromise]).then(() => {
    $loading = false;
    loaded = true;
  });
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "aktiva-tetap" });
</script>

{#if !loaded}
  <Loader />
{:else}
  <slot />
{/if}
