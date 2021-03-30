<!--routify:options title="tabel"-->
<script lang="ts">
  import type { GeneralLedgerParams, Account } from "@deboxsoft/accounting-api";
  import AccountCombox from "../../../components/account/AccountCombox.svelte";

  import { writable } from "svelte/store";
  import startOfMonth from "date-fns/startOfMonth";
  import endOfDay from "date-fns/endOfDay";
  import startOfDay from "date-fns/startOfDay";
  import isBefore from "date-fns/isBefore";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableBukuBesar from "./_tables/TableBukuBesar.svelte";
  import { getGeneralLedgerContext, getAccountContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";
  import AutoComplete from "__@comps/Autocomplete.svelte";

  const { accountStore, getAccount, getAccountChildren } = getAccountContext();
  const { getGeneralLedger } = getGeneralLedgerContext();

  let accountIds: string[];
  let endDate: Date = new Date();
  let startDate: Date = startOfMonth(endDate);
  let account = writable<Account | undefined>(undefined);
  let accountsChild;

  $: {
    if ($accountStore.length > 0) {
      if (!accountIds) {
        setAccountIds($accountStore[0].id);
      }
      if (accountIds) {
        fetchGeneralLedger();
      }
    }
  }

  async function fetchGeneralLedger() {
    if (accountIds && accountIds.length > 0) {
      const params: GeneralLedgerParams = {
        startDate,
        endDate,
        accountIds
      };
      await getGeneralLedger(params);
    }
  }

  function setAccountIds(_accountId: string) {
    account = getAccount(_accountId);
    if ($account) {
      if ($account.isParent) {
        accountsChild = getAccountChildren($account.id);
        accountIds = [$account.id, ...$accountsChild.map((_) => _.id)];
      } else {
        accountIds = [$account.id];
      }
    }
  }

  function accountChangeHandler({ detail }) {
    setAccountIds(detail);
  }

  function dateChangeHandler(e) {
    const now = new Date();
    startDate = startOfDay(e.detail[0][0] || now);
    const _tmp = endOfDay(e.detail[0][1] || now);
    endDate = isBefore(_tmp, now) ? _tmp : now;
    fetchGeneralLedger();
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements" />
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Buku Besar</h5>
      <div class="header-elements">
        <div class="list-icons">
          <AccountCombox
            id="account"
            name="account"
            on:change={accountChangeHandler}
            class="form-control"
            accountId={$account.id}
          />
          <DatePickr
            id="date"
            name="date"
            class="form-control"
            mode="menu"
            placeholder="Tanggal"
            on:close={dateChangeHandler}
            confirmEnable />
          <!--          <a class="list-icons-item" data-action="reload" />-->
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <TableBukuBesar />
      </div>
    </div>
  </div>
</PageLayout>
