<!--routify:options title="Persediaan"-->
<script>
  import { goto, url } from "@roxi/routify";
  import ProductTable from "./_components/ProductTable.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Button from "__@comps/Button.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createReportContext } from "../_export";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getAclContext } from "__@root/utils";

  const { readGranted, createGranted } = getAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const stockContext = stores.getStockContext();
  const { findPage, productStore, productPageInfo, find } = stockContext.productContext;
  const reportContext = createReportContext(stockContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "barang" });

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
          next: options.more && $productPageInfo?.next
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
      <a href={$url("./import")} class="breadcrumb-elements-item">
        <i class="icon-file-upload mr-1" />
        Impor
      </a>
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Tambah
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <Dropdown class="breadcrumb-elements-item dropdown p-0">
      <DropdownToggle class="breadcrumb-elements-item" caret nav>
        <i class="icon-file-download mr-1" />
        Ekspor
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler={dropdownClose}>
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).pdf}
          class="dropdown-item"
        >
          <i class="icon-file-pdf" />
          Download PDF</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).csv}
          class="dropdown-item"
        >
          <i class="icon-file-excel" />
          Download CSV</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).print}
          class="dropdown-item"
        >
          <i class="icon-printer2" />
          Print</a
        >
      </svelte:fragment>
    </Dropdown>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $productStore}
        <ProductTable {productStore}>
          {#if $productPageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </ProductTable>
      {:else}
        <Loader />
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
