<!--routify:options title="Transaksi Jurnal"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableTransaction from "./_tables/TableTransaction.svelte";
  import { createTransactionContext} from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  createTransactionContext();

  let fetchMoreHandler;
  let filter;

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
      <div class="w-100 form-group-feedback form-group-feedback-right">
        <input type="search" class="form-control input" placeholder="Search" />
        <div class="form-control-feedback text-grey-600">
          <i class="fal fa-search" />
        </div>
      </div>
      <DatePickr
        id="date"
        name="date"
        mode="menu"
        placeholder="Tanggal"
        confirmEnable
      />
      <button class="btn btn-light" href="#/" on:click|preventDefault={fetchMoreHandler} target="_self">
        <span>Filter</span>
      </button>
      <a href={$url("./create")} class="btn bg-primary"><i class="fal fa-plus" /></a>
    </div>
  </div>
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 h-100">
      <TableTransaction bind:fetchMoreHandler bind:filter />
    </div>
  </div>
</PageLayout>
<slot />
