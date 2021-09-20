<!--routify:options title="Trial Balance"-->
<script>
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { tick } from "svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import DatePickr from "__@comps/forms/InputDateField.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import LedgerAccountTable from "../../_libs/LedgerAccountTable.svelte";
  import { createReportContext } from "./_export";
  import Button from "__@comps/Button.svelte";

  // context
  const reportContext = createReportContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { findPageGeneralLedger, generalLedgerStore, generalLedgerPageInfo } =
    stores.createGeneralLedgerContext(applicationContext);
  const { accountStore, getAccount } = stores.getAccountContext();
  const { currentDateStore } = stores.getPreferenceAccountingContext();

  // state
  let submitting = false;
  let endDate = new Date();
  let startDate = dayjs(endDate).startOf("month").toDate();
  $: filter = {
    startDate,
    endDate
  };

  $: account = getAccount($params.id);

  $: {
    if ($account) {
      fetchData();
    }
  }

  async function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    await findPageGeneralLedger(
      $account.id,
      {
        filter,
        pageCursor: {
          next: options.more && $generalLedgerPageInfo?.next
        }
      },
      options
    );
    $loading = false;
    submitting = false;
  }

  function dateChangeHandler({ detail }) {
    const now = $currentDateStore;
    startDate = dayjs(detail.from).startOf("day").toDate();
    const _tmp = dayjs(detail.to || now)
      .endOf("day")
      .toDate();
    endDate = dayjs(_tmp).isBefore(now) ? _tmp : now;
    tick().then(() => {
      fetchData();
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      $loading = true;
      reportContext.pdf(
        $generalLedgerStore,
        (p) => {
          if (p === 1) {
            $loading = false;
          }
        },
        { account: $account, startDate, endDate }
      );
      close();
    },
    csv: () => {
      $loading = true;
      reportContext.csv($generalLedgerStore, { account: $account, startDate, endDate });
      $loading = false;
      close();
    },
    print: () => {
      $loading = true;
      reportContext.print($generalLedgerStore, { account: $account, startDate, endDate });
      $loading = false;
      close();
    }
  });
</script>

<PageLayout showBackButton breadcrumb={[{ path: "./", title: "buku besar" }, { title: "rekap per akun" }]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <div class="breadcrumb-elements-item p-0 my-auto" style="width: 180px">
      <DatePickr id="date" name="date" on:apply={dateChangeHandler} />
    </div>
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
        <LedgerAccountTable {generalLedgerStore}>
          {#if $generalLedgerPageInfo.hasNext}
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
