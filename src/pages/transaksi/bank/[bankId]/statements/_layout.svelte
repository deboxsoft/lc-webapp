<!--routify:options title="Bank"-->
<script>
  import { sortUtilsFunc } from "__@root/utils";
  import { url, params } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createReportContext } from "./_export";

  import BankStatementTable from "./_components/BankStatementTable.svelte";
  import BankInfo from "./_components/BankInfo.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Rekonsiliasi Detail" });
  const applicationContext = getApplicationContext();
  const { notify, loading } = applicationContext;
  const reportContext = createReportContext();

  const { getBank } = stores.getBankContext();
  const { getAccount } = stores.getAccountContext();
  const { findPageStatement, bank, reconcile, bankStatementStore, bankStatementPageInfo } = stores.createBankStatementContext({
    bank: getBank($params.bankId),
    ...applicationContext
  });
  let submitting = false, errors = [], isStartup = true, bankStatementList, itemsSelected, filter = {};
  $: account = getAccount($bank.accountId)

  $: {
    if (!bankStatementList && $bankStatementStore) {
      bankStatementList = $bankStatementStore
    }
  }

  fetchData();
  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    findPageStatement($bank.id, {
      filter,
      pageCursor: {
        next: options.more && $bankStatementPageInfo?.next
      }
    },
      options
    ).then(() => {
      $loading = false;
      submitting = false;
    })
  }

  async function reconcileHandler() {
    $loading = true;
    submitting = true;
    try {
      // filter
      const statements = [];
      let index = 0;
      errors = [];
      for (const { status, ...statement } of bankStatementList) {
        if ($itemsSelected.includes(index)) {
          const amount = statement.in || statement.out;
          if (!statement.accountId || !amount) {
            errors.push(index);
          }
          statements.push(statement);
        }
        index++;
      }
      statements.sort(sortUtilsFunc("id", "desc"));
      if (statements.length > 0 && !(errors.length > 0)) {
        const result = await reconcile(bank.id, statements);
        statements.forEach((_, index) => {
          statements[index] = result[index];
        });
        // reset check all
        $itemsSelected = [];
        notify("reconcile data bank telah berhasil", "success");
      } else if (statements.length === 0) {
        notify("Belum ada data yang dipillih", "error");
      } else {
        notify("Terdapat data yang belum lengkap", "error");
      }
    } catch (e) {
      console.error(e);
      // notify(e.message, "error");
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      reportContext.pdf(bankStatementList);
      close();
    },
    csv: () => {
      reportContext.csv(bankStatementList);
      close();
    },
    print: () => {
      reportContext.print(bankStatementList);
      close();
    }
  });
</script>

<PageLayout showBackButton breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href={$url("./import")} class="breadcrumb-elements-item">
      <i class="icon-file-upload2 mr-1" />
      Import
    </a>
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <Dropdown class="breadcrumb-elements-item dropdown p-0" let:dropdownClose>
      <DropdownToggle class="breadcrumb-elements-item" caret nav>
        <i class="icon-file-download2 mr-1" />
        Ekspor
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler>
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(closeHandler).pdf}
          on:mouseup={closeHandler}
          class="dropdown-item"
        >
          <i class="icon-file-pdf" />
          Download PDF</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).csv}
          on:mouseup={closeHandler}
          class="dropdown-item"
        >
          <i class="icon-file-excel" />
          Download CSV</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).print}
          on:mouseup={closeHandler}
          class="dropdown-item"
        >
          <i class="icon-printer2" />
          Print</a
        >
      </svelte:fragment>
    </Dropdown>
  </svelte:fragment>
  <div class="card flex-column flex-1 d-flex">
    <div class="card-body d-flex flex-column flex-1">
      <BankInfo {bank} {account} />
      <BankStatementTable {bankStatementList} bind:errors />
    </div>
  </div>
</PageLayout>
<slot />
