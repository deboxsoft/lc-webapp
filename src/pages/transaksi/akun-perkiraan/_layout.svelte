<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import TableAccount from "./_components/TableAccount.svelte";
  import FormFilter from "./_components/FormFilter.svelte";
  import { sortUtilsFunc } from "__@root/utils";
  import { createAclContext } from "./_acl-context";
  import { createReportContext } from "./_export";

  const { readGranted, createGranted } = createAclContext();
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { accountStore, getAccountType, getAccount } = stores.getAccountContext();
  const { loading } = getApplicationContext();
  const { csv, pdf, print } = createReportContext();

  if (!readGranted) {
    $goto("/access-denied");
  }

  setBreadcrumbContext({ path: $url("./"), title: "akun-perkiraan" });
  let accounts = [];
  let filter = undefined;
  let openFilterForm;
  let textFilter = undefined;

  let _buckets = []

  $: {
    accounts = $accountStore.sort(sortUtilsFunc("id"));
  }

  function filtering() {
    const _reduce = (result, account) => {
      // filter
      const keys = Object.keys(filter);
      let _ok = true;
      if (keys.length > 0) {
        keys.forEach((key) => {
          if (filter[key]) {
            if (account[key] !== filter[key]) {
              _ok = false;
            }
          }
        });
      }
      if (_ok) {
        if (textFilter) {
          const regex = new RegExp(`.*${textFilter.toLowerCase()}.*`);
          if (regex.test(account.name.toLowerCase())) {
            result.push(account);
          }
        } else {
          result.push(account);
        }
      }
      return result;
    };
    accounts = $accountStore.reduce(_reduce, []).sort(sortUtilsFunc("id"));
  }

  function searchHandler() {
    filtering();
  }

  function filterHandler() {
    textFilter = undefined;
    filtering();
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      pdf(accounts);
      close();
    },
    csv: () => {
      csv(accounts);
      close();
    },
    print: () => {
      print(accounts);
      close();
    }
  });
</script>

<FormFilter bind:params={filter} bind:open={openFilterForm} onFilter={filterHandler} />
<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Tambah
      </a>
    {/if}
    <a
      href="/#"
      target="_self"
      on:click|preventDefault={() => {
        openFilterForm = true;
      }}
      class="breadcrumb-elements-item"
    >
      <i class="icon-filter3 mr-1" />
      Filter
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

  <div class="header-elements" slot="header-elements">
    <div class="form-group-feedback form-group-feedback-right">
      <div class="list-icons">
        <input class="form-control input" placeholder="search" bind:value={textFilter} on:input={searchHandler} />
        <div class="form-control-feedback text-grey-600">
          <i class="icon-search4" />
        </div>
      </div>
    </div>
  </div>
  <div class="card d-flex flex-column flex-1">
    <div class="card-header header-elements-inline">
      <div />
      <div class="header-elements" />
    </div>
    <div class="card-body flex-1 flex-column d-flex">
      <TableAccount {accounts} />
    </div>
  </div>
  <slot />
</PageLayout>
