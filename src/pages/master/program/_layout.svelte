<!--routify:options title="Master Data"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { createProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import ProgramTable from "./_components/ProgramTable.svelte";
  import { createAclContext } from "__@root/utils";

  const { readGranted, createGranted } = createAclContext({
    resource: "program"
  });
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { programStore, getProgram, find } = createProgramContext(applicationContext);
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "master  /  program" });

  if (!readGranted) {
    $goto("/access-denied");
  }

  let submitting = false,
    filter = {};
  $: {
    if (!$programStore) {
      fetchData();
    }
  }

  function fetchData() {
    $loading = true;
    submitting = true;
    find(filter).then((_) => {
      programStore.set(_);
      $loading = false;
    });
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Tambah
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>

  <div class="card d-flex flex-column flex-1">
    <div class="card-body flex-1 flex-column d-flex">
      {#if $programStore}
        <ProgramTable {programStore} />
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
