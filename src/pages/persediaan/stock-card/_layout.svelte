<!--routify:options title="Persediaan"-->
<script>
  import { goto, url } from "@roxi/routify";
  import StockTable from "./_components/StockTable.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "../_acl-context";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Button from "__@comps/Button.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createReportContext } from "../_export";
  import Loader from "__@comps/loader/Loader.svelte";

  const { readGranted, createGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const reportContext = createReportContext();
  const { loading } = applicationContext;
  const { findPage, stockStore, stockPageInfo, find, productContext } = stores.getStockContext();
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
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
<!--      <a href={$url("./import")} class="breadcrumb-elements-item">-->
<!--        <i class="icon-file-upload mr-1" />-->
<!--        Impor-->
<!--      </a>-->
      <a href={$url("./stock-in")} class="breadcrumb-elements-item">
        <i class="icon-enter mr-1" />
        Masuk
      </a>
      <a href={$url("./stock-out")} class="breadcrumb-elements-item">
        <i class="icon-exit mr-1" />
        Keluar
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <a
      href={$url("./export")}
      class="breadcrumb-elements-item"
    >
      <i class="icon-file-download" />
      Ekspor</a
    >
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $stockStore}
        <StockTable {stockStore}>
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
