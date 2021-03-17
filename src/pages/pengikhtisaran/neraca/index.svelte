<!--routify:options title="tabel"-->
<script lang="ts">
  import getMonth from "date-fns/getMonth";
  import getYear from "date-fns/getYear";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableNeraca from "./_tables/TableNeraca.svelte";
  import { getGeneralLedgerContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";

  const { getBalanceSheet } = getGeneralLedgerContext();

  async function fetchBalanceSheetList(date: Date) {
    const params = {
      month: getMonth(date),
      year: getYear(date)
    }
    await getBalanceSheet(params);
  }
  fetchBalanceSheetList(new Date());


  function dateChangeHandler(e) {
    fetchBalanceSheetList(e.detail[0][0]);
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Neraca</h5>
      <div class="header-elements">
        <div class="list-icons">
          <DatePickr
            on:change={dateChangeHandler}
            id="date"
            name="date"
            class="form-control"
            mode="month-select"
            placeholder="Tanggal" />
          <!--          <a class="list-icons-item" data-action="reload" />-->
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <TableNeraca />
      </div>
    </div>
  </div>
</PageLayout>
