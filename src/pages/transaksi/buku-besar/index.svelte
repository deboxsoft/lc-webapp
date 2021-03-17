<!--routify:options title="tabel"-->
<script lang="ts">
  import type { GeneralLedgerParams } from "@deboxsoft/accounting-api";

  import getMonth from "date-fns/getMonth";
  import getYear from "date-fns/getYear";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableBukuBesar from "./_tables/TableBukuBesar.svelte";
  import { getGeneralLedgerContext, getAccountContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";
  import AutoComplete from "__@comps/Autocomplete.svelte";

  const { accountStore } = getAccountContext();
  const { getGeneralLedger } = getGeneralLedgerContext();

  let accountId: string;
  let date: Date = new Date();

  $: {
    if ($accountStore.length > 0) {
      if (!accountId) {
        accountId = $accountStore[0].id;
      }
      if (accountId) {
        fetchGeneralLedger()
      }
    }
  }

  async function fetchGeneralLedger() {
    const params: GeneralLedgerParams = {
      month: getMonth(date),
      year: getYear(date),
      accountId
    };
    await getGeneralLedger(params);
  }

  function accountChangeHandler(e) {
    accountId = e.detail;
  }

  function dateChangeHandler(e) {
    date = e.detail[0][0];
    fetchGeneralLedger()
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements" />
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Buku Besar</h5>
      <div class="header-elements">
        <div class="list-icons">
          <AutoComplete
            id="account"
            name="account"
            on:change={accountChangeHandler}
            inputClassName="form-control"
            pristineValue={accountId}
            items={$accountStore}
            keywordsFieldName="name"
            labelFieldName="name" />
          <DatePickr id="date" name="date" class="form-control" mode="month-select" placeholder="Tanggal" on:change={dateChangeHandler} />
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
