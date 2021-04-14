<!--routify:options title="Preview Import Rekening koran bank"-->
<script lang="ts">
  import { goto, url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_components/TableStatementBank.svelte";
  import { getStoreContext } from "./_store";

  const { fileDataImport, loading } = getStoreContext();

  $: {
    if (!$fileDataImport && !$loading) {
      cancelHandler();
    }
  }

  function cancelHandler() {
    $goto("./import");
  }

  function importHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={[{ title: 'Preview Rekening Bank', path: $url('./preview') }]}>
  <div class="header-elements" slot="header-elements" />
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Rekap rekening bank</h5>
    </div>
    <div class="card-body">
      <Table statementBankList={$fileDataImport || []} filtering />
    </div>
    <div class="card-footer d-flex">
      <div class="flex-grow-1" />
      <button class="btn btn-outline-primary mr-2" on:click={cancelHandler}>Batal</button>
      <button type="button" class="btn btn-primary" on:click={importHandler}>Impor</button>
    </div>
  </div>
</PageLayout>
