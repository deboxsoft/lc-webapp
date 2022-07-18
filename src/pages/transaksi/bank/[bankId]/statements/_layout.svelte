<!--routify:options title="Bank"-->
<script>
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
  import { sortUtilsFunc } from "__@root/utils";
  import { derived, writable } from "svelte/store";
  import Button from "__@comps/Button.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Rekonsiliasi Detail" });
  const applicationContext = getApplicationContext();
  const { notify, loading } = applicationContext;
  const reportContext = createReportContext();

  const { getBank } = stores.getBankContext();
  const { getAccount } = stores.getAccountContext();
  const { findPageStatement, bank, reconcile, bankStatementStore, bankStatementPageInfo } =
    stores.createBankStatementContext({
      bank: getBank($params.bankId),
      ...applicationContext
    });
  /**
   * @type {Readable<BankStatement[]>}
   */
  const bankStatementList = derived(bankStatementStore, (_store) => {
    if (_store) {
      return _store.sort(sortUtilsFunc("date", "desc"));
    }
    return _store;
  });
  let submitting = false,
    errors = [],
    ready = false,
    itemsSelected,
    filter = {};
  $: account = getAccount($bank.accountId);

  fetchData();
  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    findPageStatement(
      $bank.id,
      {
        filter,
        pageCursor: {
          next: options.more && $bankStatementPageInfo?.next
        }
      },
      options
    ).then(() => {
      $loading = false;
      submitting = false;
    });
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      reportContext.pdf($bankStatementList);
      close();
    },
    csv: () => {
      reportContext.csv($bankStatementList);
      close();
    },
    print: () => {
      reportContext.print($bankStatementList);
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
          Download PDF
        </a>
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).csv}
          on:mouseup={closeHandler}
          class="dropdown-item"
        >
          <i class="icon-file-excel" />
          Download CSV
        </a>
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).print}
          on:mouseup={closeHandler}
          class="dropdown-item"
        >
          <i class="icon-printer2" />
          Print
        </a>
      </svelte:fragment>
    </Dropdown>
  </svelte:fragment>
  <div class="card flex-column flex-1 d-flex">
    <div class="card-body d-flex flex-column flex-1">
      <BankInfo bank={$bank} account={$account} />
      <BankStatementTable bankStatementList={$bankStatementList} bind:errors>
        {#if $bankStatementPageInfo.hasNext}
          <div class="" style="height: 50px">
            <Button class="btn btn-light w-100 text-uppercase" on:click={() => fetchData({ more: true })} {submitting}>
              <i class="icon-chevron-down mr-2" />
              Muat Lebih Banyak...
            </Button>
          </div>
        {/if}
      </BankStatementTable>
    </div>
  </div>
</PageLayout>
<slot />
