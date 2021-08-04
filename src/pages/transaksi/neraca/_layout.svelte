<!--routify:options title="Neraca"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "../../../modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createAclContext } from "./_acl-context";
  import TableNeraca from "../../pengikhtisaran/neraca/_components/TableNeraca.svelte";
  import { createReportContext } from "../../pengikhtisaran/_components/_export";
  import { parsingBalanceSheetReport } from "../../pengikhtisaran/_components/_utils";

  const { readGranted } = createAclContext();
  const { loading } = getApplicationContext();
  const reportContext = createReportContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { balanceSheetReport } = stores.getBalanceContext();
  const { accountStore } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  setBreadcrumbContext({ path: $url("./"), title: "neraca" });

  let openFilterDialog;
  let date = new Date();
  let report;
  $loading = true;
  $: {
    if ($preferenceStore && $accountStore) {
      generateReportHandler().then((_) => {
        $loading = false;
      });
    }
  }

  const createExportMenuHandler = (close) => {
    const title = "NERACA";
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
  };

  async function generateReportHandler() {
    const data = await balanceSheetReport();
    console.log("generate report handler");
    report = parsingBalanceSheetReport(data);
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
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
      <TableNeraca bind:report />
    </div>
  </div>
</PageLayout>
<slot />
