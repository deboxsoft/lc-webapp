<!--routify:options title="Detail Saldo Akun Perkiraan"-->
<script>
  import { params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import LedgerAccountTable from "../../_libs/LedgerAccountTable.svelte";
  import { createReportContext } from "../../_libs/balance-per-accounte-export";
  import Button from "__@comps/Button.svelte";

  // context
  const reportContext = createReportContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { getCurrentBalanceAccount, currentBalanceStore } = stores.getBalanceContext();
  const {
    findPageGeneralLedger,
    generalLedgerPageInfo: pageInfo,
    generalLedgerStore: dataStore
  } = stores.createGeneralLedgerContext(applicationContext);
  const { accountStore, getAccount } = stores.getAccountContext();
  const { currentDateStore } = stores.getPreferenceAccountingContext();

  // state
  let submitting = false;
  const account = getAccount($params.id);

  $: {
    if ($account?.id && $currentBalanceStore) {
      fetchData();
    }
  }

  async function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    const currentBalance = (await getCurrentBalanceAccount($account.id)) || 0;
    const result = await findPageGeneralLedger($account.id, currentBalance, {
      filter: {},
      pageCursor: {
        next: options.more && $pageInfo?.next
      }
    });
    $loading = false;
    submitting = false;
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      $loading = true;
      reportContext.pdf(
        $dataStore,
        (p) => {
          if (p === 1) {
            $loading = false;
          }
        },
        { account: $account }
      );
      close();
    },
    csv: () => {
      $loading = true;
      reportContext.csv($dataStore, { account: $account });
      $loading = false;
      close();
    },
    print: () => {
      $loading = true;
      reportContext.print($dataStore, { account: $account });
      $loading = false;
      close();
    }
  });
</script>

<PageLayout
  showBackButton
  backPath={$params?.fromPath || "../"}
  breadcrumb={[
    { path: $params?.fromPath || "../", title: $params.fromLabel || "Saldo Perkiraan" },
    { title: "Detail Saldo Akun Perkiraan" }
  ]}
>
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
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $loading || !$account}
        <Loader />
      {:else}
        <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
          <dl class="row mb-0">
            <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
            <p class="col-sm-9 mb-0">
              : <span class="font-weight-bold text-uppercase">{($account && $account.name) || ""}</span>
            </p>
            <dt class="col-sm-3 mb-0">Kode</dt>
            <p class="col-sm-9 mb-0">: {($account && $account.id) || ""}</p>
          </dl>
        </div>
        <LedgerAccountTable generalLedgerList={$dataStore}>
          {#if $pageInfo.hasNext}
            <div class="" style="height: 50px">
              <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
                ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
              </Button>
            </div>
          {/if}
        </LedgerAccountTable>
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
