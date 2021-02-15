<!--routify:options title="tabel"-->
<script lang="ts">
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableBukuBesar from "./_tables/TableBukuBesar.svelte";
  import { getGeneralLedgerContext, getAccountContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";
  import AutoComplete from "__@comps/Autocomplete.svelte";

  const { findGeneralLedger } = getGeneralLedgerContext();
  const { accountStore } = getAccountContext();

  function accountChangeHandler() {}
</script>

<PageLayout>
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
            selectedItem={$accountStore.length > 0 && $accountStore[0]}
            items={$accountStore}
            keywordsFieldName="name"
            labelFieldName="name" />
          <DatePickr id="date" name="date" class="form-control" mode="month-select" placeholder="Tanggal" />
          <a class="list-icons-item" data-action="reload" />
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
