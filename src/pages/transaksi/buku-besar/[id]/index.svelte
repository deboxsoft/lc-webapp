<!--routify:options title="Trial Balance"-->
<script>
  import { params, url } from "@roxi/routify";
  import startOfMonth from "date-fns/startOfMonth";
  import endOfDay from "date-fns/endOfDay";
  import startOfDay from "date-fns/startOfDay";
  import isBefore from "date-fns/isBefore";
  import { writable } from "svelte/store";

  import { createGeneralLedgerContext, getAccountContext, getPreferenceContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import TableTrialBalance from "../_components/TableTrialBalance.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  // context
  const { loading } = getApplicationContext();
  const { getGeneralLedger } = createGeneralLedgerContext();
  const { accountStore, getAccount } = getAccountContext();
  const { currentDateStore } = getPreferenceContext();

  // state
  let endDate = new Date();
  let startDate = startOfMonth(endDate);
  let account = writable({});

  $: account = getAccount($params.id);

  $: {
    if ($account) {
      fetchGeneralLedger();
    }
  }

  async function fetchGeneralLedger() {
    $loading = true;
    const params = {
      startDate,
      endDate,
      accountId: $account.id
    };
    await getGeneralLedger(params);
    $loading = false;
  }

  function dateChangeHandler(e) {
    const now = $currentDateStore;
    startDate = startOfDay(e.detail[0][0] || now);
    const _tmp = endOfDay(e.detail[0][1] || now);
    endDate = isBefore(_tmp, now) ? _tmp : now;
    fetchGeneralLedger();
  }
</script>

<PageLayout showBackButton breadcrumb={[{ path: "./", title: "buku-besar" }, { title: "trial balance" }]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
      <DatePickr
        id="date"
        name="date"
        mode="menu"
        placeholder="Tanggal"
        on:close={dateChangeHandler}
        confirmEnable
        defaultDate={[startDate, endDate]}
        styleWrapper="width: 250px"
      />
    </div>
  </div>
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 flex-column">
      {#if $loading}
        <Loader />
      {:else}
        <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
          <dl class="row mb-0">
            <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
            <p class="col-sm-9 mb-0">: <span class="font-weight-bold text-uppercase">{$account.name}</span></p>
            <dt class="col-sm-3 mb-0">Kode</dt>
            <p class="col-sm-9 mb-0">: {$account.id}</p>
          </dl>
        </div>
        <TableTrialBalance />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
