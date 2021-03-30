<!--routify:options title="Rekonsiliasi detail"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createStoreContext } from "./_store";
  import LoaderContainer from "__@comps/loader/LoaderContainer.svelte"
  import Loader from "__@comps/loader/loader.svelte"

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Rekonsiliasi Detail" });

  export let id;
  const { loading } = createStoreContext({ bankId: id });
</script>

{#if $loading}
  <LoaderContainer>
    <Loader />
  </LoaderContainer>
{:else}
  <slot />
{/if}