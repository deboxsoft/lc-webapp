<!--routify:options title="Persediaan"-->
<script>
  import { goto, url } from "@roxi/routify";
  import StockTable from "./_components/StockTable.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Button from "__@comps/Button.svelte";
  import { createReportContext } from "../_export";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getAclContext } from "__@root/utils";

  const { readGranted, createGranted } = getAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const stockContext = stores.getStockContext();
  const { findPage, stockStore, stockPageInfo, find, productContext } = stockContext;
  const reportContext = createReportContext(stockContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "barang" });

  let submitting = false,
    productStore = productContext.productStore,
    filter = {};

  fetchData();

  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    findPage(
      {
        filter,
        pageCursor: {
          next: options.more && $stockPageInfo?.next
        }
      },
      options
    ).then(() => {
      $loading = false;
      submitting = false;
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }

  function createExportMenuHandler(close) {
    return {
      pdf: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      },
      csv: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      },
      print: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      }
    };
  }

  function onSelectHandler({ detail: stock }) {
    $goto(`./${stock.id}/view`);
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <a href={$url("./export")} class="breadcrumb-elements-item">
      <i class="icon-file-download" />
      Ekspor</a
    >
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $stockStore}
        <StockTable {stockStore} on:select={onSelectHandler}>
          {#if $stockPageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </StockTable>
      {:else}
        <Loader />
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
