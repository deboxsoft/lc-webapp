<!--routify:options title="Manajemen Bank"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import BankTable from "./_components/BankTable.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createAclContext } from "../_acl-context";
  import { createReportContext } from "./_export";
  import { getApplicationContext } from "__@modules/app";

  const { loading } = getApplicationContext();
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const { bankStore, find } = stores.getBankContext();
  const { readGranted, createGranted } = createAclContext();
  const reportContext = createReportContext();
  if (!readGranted) {
    $goto("/access-denied");
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      reportContext.pdf($bankStore);
      close();
    },
    csv: () => {
      reportContext.csv($bankStore);
      close();
    },
    print: () => {
      reportContext.print($bankStore);
      close();
    }
  });

  function fetchData() {
    $loading = true;
    find().then((result) => {
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
      {#if $bankStore}
        <BankTable {bankStore} />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
