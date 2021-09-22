<!--routify:options title="Persediaan"-->
<script>
  import { onMount } from "svelte";
  import CategoryInventoryTable from "./_components/SupplierTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAclContext } from "../_acl-context";
  import Loader from "__@comps/loader/Loader.svelte";

  const { createGranted } = getAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "kategori" });
  const { find, supplierStore, subscribe } = stores.createSupplierContext(applicationContext);

  let submitting = false,
    filter = {};

  onMount(() => {
    fetchData();
    return subscribe();
  })

  function fetchData() {
    $loading = true;
    submitting = true;
    find().then((_) => {
      $supplierStore = _;
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
        Tambah
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if !submitting && $supplierStore}
        <CategoryInventoryTable {supplierStore} />
      {:else}
        <Loader />
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
