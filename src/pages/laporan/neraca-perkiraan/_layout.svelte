<!--routify:options title="Laporan"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "../../../modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import { createAclContext } from "../_acl-context";
  import TableNeraca from "../_libs/BalanceSheetTable.svelte";
  import { createReportContext } from "../_libs/balance-export";
  import { parsingBalanceSheetReport } from "../_libs/helper";
  import Loader from "../../../components/loader/Loader.svelte";

  const { readGranted } = createAclContext("balanceSheet");
  const applicationContext = getApplicationContext();
  const { loading } = getApplicationContext();
  const reportContext = createReportContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { balanceReport } = stores.createBalanceReportContext(applicationContext);
  const { accountStore } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  setBreadcrumbContext({ path: $url("./"), title: "Neraca Perkiraan" });

  let openFilterDialog, report;
  $loading = true;
  $: {
    if ($preferenceStore && $accountStore) {
      fetchData().then((_) => {
        $loading = false;
      });
    }
  }

  function createExportMenuHandler(close) {
    const title = "NERACA PERKIRAAN";
    const getItemListReport = () => {
      const { balanceSheetReport, statementIncomeBalance, assetsBalance, liabilitiesBalance } = report;
      return [
        balanceSheetReport.assetsCurrent.accounts,
        { label: "TOTAL AKTIVA", balance: balanceSheetReport.assetsCurrent.balance },
        balanceSheetReport.liabilitiesCurrent.accounts,
        { label: "TOTAL PASIVA", balance: balanceSheetReport.liabilitiesCurrent.balance },
        { label: "LABA/RUGI", balance: statementIncomeBalance },
        { label: "SELISIH", balance: assetsBalance - liabilitiesBalance }
      ];
    };
    return {
      pdf: () => {
        $loading = true;
        reportContext.pdf(
          getItemListReport(),
          (p) => {
            if (p === 1) {
              $loading = false;
            }
          },
          { title }
        );
        close();
      },
      csv: () => {
        $loading = true;
        reportContext.csv(getItemListReport(), { title });
        $loading = false;
        close();
      },
      print: () => {
        $loading = true;
        reportContext.print(getItemListReport(), { title });
        $loading = false;
        close();
      }
    };
  }

  function fetchData() {
    $loading = true;
    return balanceReport().then((data) => {
      report = parsingBalanceSheetReport(data);
      $loading = false;
    });
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
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
        <TableNeraca key="neraca-perkiraan" bind:report />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
