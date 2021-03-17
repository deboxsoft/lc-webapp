<!--routify:options title="Rekonsiliasi Bank"-->
<script lang="ts">
  import { createReconciliationContext } from "__@modules/accounting";
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import LoaderContainer from "__@comps/loader/LoaderContainer.svelte"
  import Loader from "__@comps/loader/loader1.svelte"

  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "rekonsiliasi bank" });
  const { find } = createReconciliationContext();
  let loading = true;
  find().then((result) => {
    loading = false;
  });
</script>

{#if loading}
  <LoaderContainer>
    <Loader />
  </LoaderContainer>
{:else}
  <slot />
{/if}
