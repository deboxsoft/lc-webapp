<!--routify:options title="Tabel Statement Bank"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_comps/TableStatementBank.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./import')} class="btn bg-slate mr-2"><i class="icon-import mr-2" />Import</a>
    <a href={$url('./history')} class="btn bg-slate"><i class="icon-history mr-2" />History</a>
  </div>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Rekap rekening bank</h5>
      <div class="header-elements">
        <div class="list-icons">
          <DatePickr id="date" name="date" class="form-control" placeholder="Tanggal" />
        </div>
      </div>
    </div>
    <div class="card-body">
      <Table />
    </div>
  </div>
</PageLayout>
