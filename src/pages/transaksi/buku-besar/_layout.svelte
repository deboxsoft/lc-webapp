<!--routify:options title="Buku Besar"-->
<script lang="ts">
  import type { GeneralLedgerParams, Account } from "@deboxsoft/accounting-api";
  import { url } from "@roxi/routify";
  import { writable } from "svelte/store";
  import startOfMonth from "date-fns/startOfMonth";
  import endOfDay from "date-fns/endOfDay";
  import startOfDay from "date-fns/startOfDay";
  import isBefore from "date-fns/isBefore";

  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createGeneralLedgerContext, getAccountContext, getPreferenceContext } from "__@modules/accounting";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableBukuBesar from "./_components/TableBukuBesar.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";

  // context
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "buku-besar" });
  const { getGeneralLedger } = createGeneralLedgerContext();
  const { accountStore, getAccount, getAccountChildren } = getAccountContext();
  const { currentDateStore } = getPreferenceContext();


  // state
  let loading
  let accountIds: string[];
  let endDate: Date = new Date();
  let startDate: Date = startOfMonth(endDate);
  let account;
  let accountsChild;

  $: {
    if ($accountStore.length > 0) {
      if (!accountIds) {
        setAccount($accountStore[0]);
      }
      if (accountIds) {
        fetchGeneralLedger();
      }
    }
  }

  async function fetchGeneralLedger() {
    if (accountIds && accountIds.length > 0) {
      loading = true
      const params: GeneralLedgerParams = {
        startDate,
        endDate,
        accountIds
      };
      await getGeneralLedger(params);
      loading = false;
    }
  }

  function setAccount(_account: Account) {
    account = _account;
    if (account) {
      // if (account.isParent) {
      //   accountsChild = getAccountChildren(account.id);
      //   accountIds = [account.id, ...$accountsChild.map((_) => _.id)];
      // } else {
      accountIds = [account.id];
      // }
    }
  }

  function accountChangeHandler({ detail }) {
    setAccount(detail);
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
      <AccountSelect id="account" name="account" on:change={accountChangeHandler} accountId={account.id} />
      <DatePickr
        id="date"
        name="date"
        mode="menu"
        placeholder="Tanggal"
        on:close={dateChangeHandler}
        confirmEnable
        defaultDate={[startDate, endDate]}
      />
      <!--          <a class="list-icons-item" data-action="reload" />-->
    </div>
  </div>
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1">
      <TableBukuBesar bind:accountIds />
    </div>
  </div>
</PageLayout>
<slot />
