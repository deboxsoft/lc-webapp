<!--routify:options title="Manajemen Bank"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_components/TableBank.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createAclContext } from "../_acl-context";
  import { createReportContext } from "./_export";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const { readGranted, createGranted } = createAclContext();
  const reportContext = createReportContext();
  let bankList;
  if (!readGranted) {
    $goto("/access-denied");
  }

  setBreadcrumbContext({ path: $url("./"), title: "bank" });
  const createExportMenuHandler = (close) => ({
    pdf: () => {
      reportContext.pdf(bankList);
      close();
    },
    csv: () => {
      reportContext.csv(bankList);
      close();
    },
    print: () => {
      reportContext.print(bankList);
      close();
    }
  });
</script>
<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Tambah
      </a>
    {/if}
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
      <Table bind:bankList />
    </div>
  </div>
</PageLayout>
<slot />
