<!--routify:options title="Buku Besar"-->
<script>
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { createReportContext } from "../_libs/ledger_export";
  import LedgerTable from "../_libs/LedgerTable.svelte";
  import { writable } from "svelte/store";
  const { loading: topLoading } = getApplicationContext();
  const { getFixedAccountsBalance, balanceContext } = stores.getBalanceReportContext();
  const { getFixedBalance } = balanceContext;
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Buku Besar" });
  const accountsBalance = getFixedAccountsBalance();

  const reportContext = createReportContext({
    title: "BUKU BESAR"
  });
  const createExportMenuHandler = (close) => ({
    pdf: () => reportContext.pdf({ accountsBalance: $accountsBalance }),
    csv: () => reportContext.csv({ accountsBalance: $accountsBalance }),
    print: () => reportContext.print({ accountsBalance: $accountsBalance })
  });

  let loading = writable(true);
  $topLoading = true;

  $: {
    if ($accountsBalance) {
      $loading = false;
      $topLoading = false;
    }
  }

  function refresh() {
    $loading = true;
    $topLoading = true;
    getFixedBalance({ refresh: true });
    $loading = false;
    $topLoading = false;
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href="#/" target="_self" on:click={refresh} class="breadcrumb-elements-item">
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
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $loading}
        <Loader />
      {:else}
        <LedgerTable {accountsBalance} />
      {/if}
    </div>
  </div>
</PageLayout>
