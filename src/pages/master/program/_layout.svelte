<!--routify:options title="Program"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import ProgramList from "./_components/ProgramTable.svelte";
  import { sortUtilsFunc } from "__@root/utils";
  import { createAclContext } from "./_acl-context";
  import ProgramForm from "./_components/ProgramForm.svelte";

  const { readGranted, createGranted } = createAclContext();
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { programStore, getProgram } = getProgramContext();
  const { loading } = getApplicationContext();

  if (!readGranted) {
    $goto("/access-denied");
  }

  setBreadcrumbContext({ path: $url("./"), title: "master  /  program" });
  let filter = undefined;
  let openFilterDialog;
  let closeFilterDialog;
  let textFilter = undefined;

  let _buckets = [];

  $: programList = $accountStore.sort(sortUtilsFunc("id"));

</script>

<ProgramForm bind:params={filter} />
<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Tambah
      </a>
    {/if}
  </svelte:fragment>

  <div class="card d-flex flex-column flex-1">
    <div class="card-header header-elements-inline">
      <div />
      <div class="header-elements" />
    </div>
    <div class="card-body flex-1 flex-column d-flex">
      <ProgramList {programList} />
    </div>
  </div>
  <slot />
</PageLayout>
