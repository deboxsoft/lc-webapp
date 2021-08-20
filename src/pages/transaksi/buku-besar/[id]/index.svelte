<!--routify:options title="Trial Balance"-->
<script>
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { writable } from "svelte/store";
  import {tick} from "svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import TableTrialBalance from "../_components/TableTrialBalance.svelte";
  import Dropdown from "../../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../../components/DropdownToggle.svelte";
  import DatePickr from "../../../../components/forms/InputDateField.svelte";
  import Loader from "../../../../components/loader/Loader.svelte";
  import { createReportContext } from "./_export";

  // context
  const reportContext = createReportContext();
  const { loading, ...appContext } = getApplicationContext();
  const { findPageGeneralLedger, generalLedgerStore } = stores.createGeneralLedgerContext(appContext);
  const { accountStore, getAccount } = stores.getAccountContext();
  const { currentDateStore } = stores.getPreferenceAccountingContext();

  // state
  let endDate = new Date();
  let startDate = dayjs(endDate).startOf("month").toDate();
  let account = writable({});
  $: filter = {
    startDate,
    endDate
  }

  $: account = getAccount($params.id);

  $: {
    if ($account) {
      fetchGeneralLedger();
    }
  }

  async function fetchGeneralLedger() {
    $loading = true;
    await findPageGeneralLedger($account.id, { filter }, {});
    $loading = false;
  }

  function dateChangeHandler({ detail }) {
    const now = $currentDateStore;
    startDate = dayjs(detail.from).startOf("day").toDate();
    const _tmp = dayjs(detail.to || now)
      .endOf("day")
      .toDate();
    endDate = dayjs(_tmp).isBefore(now) ? _tmp : now;
    tick().then(() => {
      fetchGeneralLedger();
    })
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

<PageLayout showBackButton breadcrumb={[{ path: "./", title: "buku-besar" }, { title: "trial balance" }]}>
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
        <TableTrialBalance {account} {filter} />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
