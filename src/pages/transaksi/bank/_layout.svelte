<!--routify:options title="Data Bank"-->
<script lang="ts">
  import { createReconciliationContext } from "__@modules/accounting";
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "__@comps/loader/Loader.svelte"

  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Data bank" });
  const { find } = createReconciliationContext();
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
