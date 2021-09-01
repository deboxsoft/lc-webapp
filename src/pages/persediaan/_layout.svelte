<!--routify:options title="Persediaan"-->
<script>
  import { goto, url } from "@roxi/routify";
  import StockTable from "./_components/StockTable.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "../bdd/_acl-context";
  import { getBreadcrumbStore } from "../../stores/breadcrumb";
  import PageLayout from "../../layout/PageLayout.svelte";
  import Button from "../../components/Button.svelte";
  import Dropdown from "../../components/Dropdown.svelte";
  import DropdownToggle from "../../components/DropdownToggle.svelte";
  import { createReportContext } from "./_export";

  const { readGranted, createGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const reportContext = createReportContext();
  const { loading } = applicationContext;
  const { findPage, stockStore, stockPageInfo, find } = stores.createStockContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Persediaan" });

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
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Posting
      </a>
    {/if}
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <Dropdown class="breadcrumb-elements-item dropdown p-0">
      <DropdownToggle class="breadcrumb-elements-item" caret nav>
        <i class="icon-file-download2 mr-1" />
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
      <StockTable {stockStore}>
        {#if $stockPageInfo.hasNext}
          <div class="" style="height: 50px">
            <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
              ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
            </Button>
          </div>
        {/if}
      </StockTable>
    </div>
  </div>
  <slot />
</PageLayout>
