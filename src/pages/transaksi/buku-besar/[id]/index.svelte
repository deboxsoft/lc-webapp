<!--routify:options title="Trial Balance"-->
<script>
  import { params } from "@roxi/routify";
  import startOfMonth from "date-fns/startOfMonth";
  import endOfDay from "date-fns/endOfDay";
  import startOfDay from "date-fns/startOfDay";
  import isBefore from "date-fns/isBefore";

  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createGeneralLedgerContext, getAccountContext, getPreferenceContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getApplicationContext } from "__@modules/app";
  import TableTrialBalance from "../_components/TableTrialBalance.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  // context
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "buku-besar" });
  const { loading } = getApplicationContext();
  const { getGeneralLedger } = createGeneralLedgerContext();
  const { accountStore, getAccount } = getAccountContext();
  const { currentDateStore } = getPreferenceContext();

  // state
  let endDate = new Date();
  let startDate = startOfMonth(endDate);
  let account = writable(undefined);

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

<PageLayout breadcrumb={[]}>
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
    <div class="card-body d-flex flex-1">
      {#if $loading}
        <Loader />
      {:else}
        <TableTrialBalance />
      {/if}
    </div>
  </div>
</PageLayout>
<slot />
