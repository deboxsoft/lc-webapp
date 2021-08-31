<!--routify:options title="Buku Besar"-->
<script>
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import TableAccountBalance from "./_components/TableAccountBalance.svelte";
  import { createReportContext } from "./_export";
  import { getApplicationContext } from "__@modules/app";

  const reportContext = createReportContext();
  const { loading } = getApplicationContext();
  const { balanceSheetReport } = stores.getBalanceContext();
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Buku Besar" });

  let accounts;

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      $loading = true;
      reportContext.pdf(
        $accounts,
        (p) => {
          if (p === 1) {
            $loading = false;
          }
        },
        {}
      );
      close();
    },
    csv: () => {
      $loading = true;
      reportContext.csv($accounts, {});
      $loading = false;
      close();
    },
    print: () => {
      $loading = true;
      reportContext.print($accounts, {});
      $loading = false;
      close();
    }
  });

  function fetchData() {
    $loading = true;
    balanceSheetReport().then(() => {
      $loading = false;
    })
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Sinkronisasi
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
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 flex-column">
      <TableAccountBalance bind:accounts />
    </div>
  </div>
</PageLayout>
