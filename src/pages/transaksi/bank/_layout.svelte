<!--routify:options title="Manajemen Bank"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "../../../components/loader/Loader.svelte"
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Data bank" });
  const applicationContext = getApplicationContext();
  const { find } = stores.createBankContext(applicationContext);
  let loading = true;
  find().then((result) => {
    loading = false;
  });
</script>

{#if loading}
  <Loader />
{:else}
  <slot />
{/if}
