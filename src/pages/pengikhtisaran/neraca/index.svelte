<!--routify:options title="tabel"-->
<script lang="ts">
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableNeraca from "./_tables/TableNeraca.svelte";
  import { getGeneralLedgerContext} from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";

  const { generalLedgerStore } = getGeneralLedgerContext();
</script>

<PageLayout breadcrumb={[]}>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Neraca</h5>
      <div class="header-elements">
        <div class="list-icons">
          <DatePickr id="date" name="date" class="form-control" mode="month-select" placeholder="Tanggal" />
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
