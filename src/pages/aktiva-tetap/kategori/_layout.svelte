<!--routify:options title="Kategori"-->
<script>
  import CategoryInventoryTable from "../_components/CategoryInventoryTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAclContext } from "__@root/utils";

  const { createGranted } = getAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "kategori" });
  const { findCategory, categoryInventoryStore } = stores.getInventoryContext();

  let submitting = false,
    filter = {};

  fetchData();

  function fetchData() {
    $loading;
    submitting = true;
    findCategory().then(() => {
      $loading = false;
      submitting = false;
    });
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2" />
        Tambah Kategori
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $categoryInventoryStore}
        <CategoryInventoryTable {categoryInventoryStore} />
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
