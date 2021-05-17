<!--routify:options title="Data Bank"-->
<script>
  import { createBankContext } from "__@modules/accounting";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "__@comps/loader/Loader.svelte"
  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Data bank" });
  const { find } = createBankContext();
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
