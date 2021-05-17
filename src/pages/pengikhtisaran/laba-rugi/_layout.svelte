<!--routify:options title="Laba Rugi"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getPreferenceContext, getBalanceContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableLabaRugi from "./_components/TableLabaRugi.svelte";
  import DatePickr from "__@comps/DatePickr.svelte";

  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const { currentDateStore } = getPreferenceContext();
  const { perDate, generateReport } = getBalanceContext();
  setBreadcrumbContext({ path: $url("./"), title: "neraca" });

  let generateReportHandler;

  function dateChangeHandler(e) {
    $perDate = e.detail[0][0];
    generateReportHandler();
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
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 h-100">
      <TableLabaRugi bind:generateReportHandler />
    </div>
  </div>
</PageLayout>
<slot />
