<!--routify:options title="Kasir"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { createCashierContext, createProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createAclContext } from "__@root/utils";
  import { getApplicationContext } from "__@modules/app";
  import CashierTable from "./_components/CashierTable.svelte";
  import Button from "__@comps/Button.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { readGranted, createGranted, approveGranted } = createAclContext({
    resource: "cashier"
  });
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { findPage, cashierStore, cashierPageInfo } = createCashierContext(applicationContext);
  const { find: programFind, programStore } = createProgramContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Kasir" });

  let submitting = false,
    filter = {};

  fetchData();
  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    const promiseList = [];
    const cashierPromise = findPage(
      {
        filter,
        pageCursor: {
          next: options.more && $cashierPageInfo?.next
        }
      },
      options
    );
    promiseList.push(cashierPromise);
    if (!$programStore) {
      const programPromise = programFind(filter);
      promiseList.push(programPromise);
    }

    Promise.all(promiseList).then(([_, __]) => {
      if (__) {
        programStore.set(__);
      }
      $loading = false;
      submitting = false;
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Posting
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $cashierStore && $programStore}
        <CashierTable {cashierStore}>
          {#if $cashierPageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </CashierTable>
      {:else}
        <Loader />
      {/if}
    </div>
  </div>
  {#if $programStore}
    <slot />
  {/if}
</PageLayout>
