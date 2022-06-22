<!--routify:options title="Laporan"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createAclContext } from "__@root/utils";
  import TableNeraca from "../_libs/BalanceSheetTable.svelte";
  import { balanceSheetContext } from "../_libs/balance-export";
  import { writable } from "svelte/store";
  import Loader from "__@comps/loader/Loader.svelte";

  const { readGranted } = createAclContext({ resource: "balanceSheet" });
  const applicationContext = getApplicationContext();
  const { loading: topLoading } = getApplicationContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { fixedBalanceSheetReportStore, balanceContext } = stores.getBalanceReportContext();
  const { getFixedBalance } = balanceContext;
  const { getAccountsTree } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const accountStore = getAccountsTree();
  setBreadcrumbContext({ path: $url("./"), title: "Laporan Neraca" });

  let openFilterDialog,
    balanceSheetReport,
    loading = writable(true);
  $topLoading = true;
  $: {
    if ($fixedBalanceSheetReportStore) {
      balanceSheetReport = $fixedBalanceSheetReportStore;
      $loading = false;
      $topLoading = false;
    }
  }
  const createExportMenuHandler = (close) => {
    const title = "LAPORAN NERACA";
    const context = balanceSheetContext({
      title,
      loading,
      close
    });
    return {
      pdf: () => context.pdf({ balanceSheetReport }),
      csv: () => context.csv({ balanceSheetReport }),
      print: () => context.print({ balanceSheetReport })
    };
  };

  async function fetchData() {
    $loading = true;
    $topLoading = true;
    await getFixedBalance({ refresh: true });
    $loading = false;
    $topLoading = false;
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <!--    <div class="breadcrumb-elements-item p-0 my-auto" style="width: 115px">-->
    <!--      <InputDate id="date" name="date" on:apply={applyDateHandler} range={false} />-->
    <!--    </div>-->
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
      {#if $loading}
        <Loader />
      {:else}
        <TableNeraca key="neraca" {balanceSheetReport} />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
