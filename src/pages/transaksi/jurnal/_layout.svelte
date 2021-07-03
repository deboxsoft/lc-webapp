<!--routify:options title="Transaksi Jurnal"-->
<script>
  import {tick} from "svelte";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableTransaction from "./_tables/TableTransaction.svelte";
  import FormFilter from "./_forms/FormFilter.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createReportContext } from "./_export";
  // import DatePickr from "__@comps/DatePickr.svelte";

  const report = createReportContext();
  const { readGranted, createGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const applicationContext = getApplicationContext();
  const accountContext = stores.getAccountContext();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  const { load, find, transactionStore } = stores.createTransactionContext({ accountContext, ...applicationContext });
  const {loading: topLoading} = applicationContext;

  let filter = {};
  let openFilterForm;
  let textFilter = undefined;
  let fetchMor;
  let transactions = [];

  $topLoading = true;
  let loading;
  filtering();
  find({ filter }).then(() => {
    loading = false;
    $topLoading = false;
  });

  $: {
    $transactionStore, filtering();
  }

  function filtering() {
    if ($transactionStore) {
      const _reduce = (result, transaction) => {
        const keys = Object.keys(filter);
        let _ok = true;
        if (keys.length > 0) {
          keys.forEach((key) => {
            if (filter[key]) {
              if (transaction[key] !== filter[key]) {
                _ok = false;
              }
            }
          });
        }
        if (_ok) {
          if (textFilter) {
            const regex = new RegExp(`.*${textFilter.toLowerCase()}.*`);
            if (regex.test(transaction.description.toLowerCase())) {
              result.push(transaction);
            }
          } else {
            result.push(transaction);
          }
        }
        return result;
      }
      transactions = $transactionStore.reduce(_reduce, []);
    }
  }

  function searchHandler() {
    filtering();
  }

  function filterHandler() {
    textFilter = undefined;
    $topLoading = true;
    loading = true;
    filtering();
    tick().then(() => {
      $topLoading = false;
      loading = false;
    })
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
     report.pdf(transactions);
      close();
    },
    csv: () => {
      report.csv(transactions);
      close();
    },
    print: () => {
      report.print(transactions);
      close();
    }
  });
</script>

<FormFilter bind:params={filter} bind:open={openFilterForm} onFilter={filterHandler} />
<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right" let:closeHandler={dropdownClose}>
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Posting
      </a>
    {/if}
    <a href="/#" target="_self" on:click|preventDefault={() => {
      openFilterForm = true;
    }} class="breadcrumb-elements-item">
      <i class="icon-filter3 mr-1" />
      Filter
    </a>
    <Dropdown class="breadcrumb-elements-item dropdown p-0">
      <DropdownToggle class="breadcrumb-elements-item" caret nav>
        <i class="icon-file-download2 mr-1" />
        Ekspor
      </DropdownToggle>
      <svelte:fragment slot="menu">
        <a href="/#" target="_self" on:click|preventDefault={createExportMenuHandler(dropdownClose).pdf} class="dropdown-item">Download PDF</a>
        <a href="/#" target="_self" on:click|preventDefault={createExportMenuHandler(dropdownClose).csv} class="dropdown-item">Download CSV</a>
        <a href="/#" target="_self" on:click|preventDefault={createExportMenuHandler(dropdownClose).print} class="dropdown-item">Print</a>
      </svelte:fragment>
    </Dropdown>
  </svelte:fragment>
  <div class="header-elements" slot="header-elements">
    <div class="form-group-feedback form-group-feedback-right">
      <div class="list-icons">
        <input class="form-control input" placeholder="search" on:input={filterHandler} />
        <div class="form-control-feedback text-grey-600">
          <i class="icon-search4" />
        </div>
      </div>
    </div>
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableTransaction bind:filter bind:loading {transactions} />
    </div>
  </div>
  <slot />
</PageLayout>
