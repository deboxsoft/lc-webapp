<!--routify:options title="Rekonsiliasi detail"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createBankStatementContext, getBankContext } from "__@modules/accounting";

  import TableStatementBank from "./_components/TableStatementBank.svelte";
  // import DatePickr from "__@comps/DatePickr.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Rekonsiliasi Detail" });

  export let id;
  let loading = true;

  const { getBank } = getBankContext();
  const {findStatement} = createBankStatementContext(getBank(id));

  $: {
    if (id) {
      findStatement(id, {}).then(() => {
        loading = false;
      })
    }
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
<!--      <DatePickr id="date" name="date" class="form-control" placeholder="Tanggal" />-->
      <a href={$url("./import")} class="btn bg-slate btn-icon"><i class="icon-import" /></a>
      <!--    <a href={$url("./history")} class="btn bg-slate"><i class="icon-history mr-2" />History</a>-->
    </div>
  </div>
  <div class="card flex-column flex-1 d-flex">
    <div class="card-body d-flex flex-column flex-1">
      <TableStatementBank bind:loading />
    </div>
  </div>
</PageLayout>
<slot />
