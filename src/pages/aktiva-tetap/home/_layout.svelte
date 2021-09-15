<!--routify:options title="Aktiva Tetap"-->
<script>
  import InventoryTable from "../_components/InventoryTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Button from "../../../components/Button.svelte";
  import { getApplicationContext } from "../../../modules/app";
  import { url } from "@roxi/routify";
  import PageLayout from "../../../layout/PageLayout.svelte";
  import { getAclContext } from "../_acl-context";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import { createReportContext } from "../_export";

  const reportContext = createReportContext();
  const applicationContext = getApplicationContext();
  const { createGranted } = getAclContext();
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "data tabel" });
  const { loading } = applicationContext;
  const { findPage, inventoryStore, inventoryPageInfo } = stores.getInventoryContext();

  let submitting = false,
    filter = {};

  fetchData();

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

  function fetchData(options = {}) {
    $loading;
    submitting = true;
    findPage(
      {
        filter,
        pageCursor: {
          next: options.more && $inventoryPageInfo?.next
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
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2" />
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
      {#if $inventoryStore}
        <InventoryTable {inventoryStore}>
          {#if $inventoryPageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </InventoryTable>
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
