<!--routify:options title="Neraca"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableNeraca from "./_components/TableNeraca.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";
  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { currentDateStore } = stores.getPreferenceAccountingContext();
  const { balanceSheetReportPerDate } = stores.getBalanceContext();
  setBreadcrumbContext({ path: $url("./"), title: "neraca" });

  let generateReportHandler;

  function dateChangeHandler(e) {
    const perDate = e.detail[0][0];
    generateReportHandler(perDate);
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
      <DatePickr
        id="date"
        name="date"
        placeholder="Tanggal"
        on:close={dateChangeHandler}
        defaultValue={$currentDateStore}
        confirmEnable
      />
    </div>
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableNeraca date={$currentDateStore} bind:generateReportHandler />
    </div>
  </div>
</PageLayout>
<slot />
