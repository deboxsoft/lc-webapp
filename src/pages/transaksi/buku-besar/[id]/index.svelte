<!--routify:options title="Trial Balance"-->
<script>
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { writable } from "svelte/store";

  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import TableTrialBalance from "../_components/TableTrialBalance.svelte";
  import DatePickr from "__@comps/forms/InputDateField.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  // context
  const { loading, ...appContext } = getApplicationContext();
  const { findPageGeneralLedger } = stores.createGeneralLedgerContext(appContext);
  const { accountStore, getAccount } = stores.getAccountContext();
  const { currentDateStore } = stores.getPreferenceAccountingContext();

  // state
  let endDate = new Date();
  let startDate = dayjs(endDate).startOf("month").toDate();
  let account = writable({});

  $: account = getAccount($params.id);

  $: {
    if ($account) {
      fetchGeneralLedger();
    }
  }

  async function fetchGeneralLedger() {
    $loading = true;
    const filter = {
      startDate,
      endDate,
      accountId: $account.id
    };
    await findPageGeneralLedger({ filter });
    $loading = false;
  }

  function dateChangeHandler(e) {
    const now = $currentDateStore;
    startDate = dayjs(e.detail[0][0]).startOf("day").toDate();
    const _tmp = dayjs(e.detail[0][1] || now)
      .endOf("day")
      .toDate();
    endDate = dayjs(_tmp).isBefore(now) ? _tmp : now;
    fetchGeneralLedger();
  }
</script>

<PageLayout showBackButton breadcrumb={[{ path: "./", title: "buku-besar" }, { title: "trial balance" }]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <DatePickr
      id="date"
      wrapperClass="breadcrumb-elements-item p-0"
      name="date"
      mode="menu"
      placeholder="Tanggal"
      on:close={dateChangeHandler}
      confirmEnable
      defaultDate={[startDate, endDate]}
      styleWrapper="width: 250px"
    />
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
        <TableTrialBalance />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
