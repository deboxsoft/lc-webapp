<!--routify:options title="Tabel Histori Rekonsiliasi"-->
<script lang="ts">
  import type { BankReconciliation } from "@deboxsoft/accounting-api";
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_comps/TableHistoryImportReconciliation.svelte";

  export let bankReconciliation: BankReconciliation;
</script>

<PageLayout breadcrumb={{ title: 'Tabel Histori Rekonsiliasi', path: $url('./history') }}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./import-reconciliation')} class="btn bg-slate mr-2"><i class="icon-import mr-2" />Import</a>
    <a href={$url('./history')} class="btn bg-slate"><i class="icon-history mr-2" />History</a>
  </div>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Histori Rekonsiliasi</h5>
      <div class="header-elements" />
    </div>
    <div class="card-body">
      <Table />
    </div>
  </div>
</PageLayout>
