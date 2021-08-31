<!--routify:options title="Laporan"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableLabaRugi from "./_components/TableLabaRugi.svelte";
  import DatePickr from "../../../components/forms/InputDateField.svelte";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import { createAclContext } from "./_acl-context";
  import { createReportContext } from "../_components/_export";
  import { parsingRevenueReport } from "../_components/_utils";

  const { readGranted } = createAclContext();
  const { loading } = getApplicationContext();
  const reportContext = createReportContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const { balanceSheetReportPerDate } = stores.getBalanceContext();
  setBreadcrumbContext({ path: $url("./"), title: "neraca" });

  let openFilterDialog;
  let date = new Date();
  $loading = true;
  let report;
  generateReportHandler(date).then((_) => {
    $loading = false;
    return _;
  });
  const createExportMenuHandler = (close) => {
    const title = "LABA-RUGI";
    const getItemListReport = () => {
      const { statementIncomeReport, revenueBalance, expenseBalance, statementIncomeBalance } = report;
      return [
        statementIncomeReport.revenue.accounts,
        { label: "TOTAL PENDAPATAN", balance: statementIncomeReport.revenue.balance },
        statementIncomeReport.expense.accounts,
        { label: "TOTAL BIAYA", balance: statementIncomeReport.expense.balance },
        { label: "LABA/RUGI", balance: statementIncomeBalance }
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

  export async function generateReportHandler(date) {
    $loading = true;
    const data = await balanceSheetReportPerDate(date);
    report = parsingRevenueReport(data);
    $loading = false;
  }

  function applyDateHandler({ detail }) {
    date = detail.date;
    generateReportHandler(date);
  }

  function fetchData() {
    generateReportHandler(date)
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <div class="breadcrumb-elements-item p-0 my-auto" style="width: 115px">
      <DatePickr id="date" name="date" selected={date} on:apply={applyDateHandler} range={false} />
    </div>
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
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      <TableLabaRugi bind:report />
    </div>
  </div>
</PageLayout>
<slot />
