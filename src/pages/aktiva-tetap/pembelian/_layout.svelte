<!--routify:options title="Pembelian Barang"-->
<script>
  import PurchaseTable from "./_components/PurchaseTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import { goto, url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAclContext } from "__@root/utils";
  import { onMount } from "svelte";
  import Button from "__@comps/Button.svelte";

  const { createGranted, readGranted } = getAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  if (!readGranted) {
    $goto("/access-denied");
  }
  setBreadcrumbContext({ path: $url("./"), title: "pembelian" });
  const { findPage, inventoryTransactionStore, subscribe, inventoryTransactionPageInfo } =
    stores.createInventoryTransactionContext(applicationContext);
  onMount(() => {
    return subscribe();
  });

  let submitting = false,
    filter = {};

  fetchData();

  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    findPage(
      {
        filter,
        pageCursor: {
          next: options.more && $inventoryTransactionPageInfo?.next
        }
      },
      options
    ).then((_) => {
      $loading = false;
      submitting = false;
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }

  function selectHandler(item) {
    $goto(`./${item.id}/view`);
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
      {#if $inventoryTransactionStore}
        <PurchaseTable {inventoryTransactionStore} onSelect={selectHandler}>
          {#if $inventoryTransactionPageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </PurchaseTable>
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
