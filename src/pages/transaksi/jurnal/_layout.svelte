<!--routify:options title="Transaksi Jurnal"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableTransaction from "./_tables/TableTransaction.svelte";
  import { createTransactionContext } from "__@modules/accounting";
  import { createAclContext } from "./_acl-context";
  // import DatePickr from "__@comps/DatePickr.svelte";

  const { readGranted, createGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  const { load } = createTransactionContext();

  let filter;
  let fetchMor;

  let loading;
  load().then(() => {
    loading = false;
  });

  function filterHandler() {
    // find({ filter });
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
      <!--      <div class="w-100 form-group-feedback form-group-feedback-right">-->
      <!--        <input type="search" class="form-control input" placeholder="Search" />-->
      <!--        <div class="form-control-feedback text-grey-600">-->
      <!--          <i class="fal fa-search" />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <DatePickr id="date" name="date" mode="menu" placeholder="Tanggal" confirmEnable />-->
      <!--      <button class="btn btn-light" href="#/" on:click|preventDefault={filterHandler} target="_self">-->
      <!--        <span>Filter</span>-->
      <!--      </button>-->
      {#if createGranted}
        <a href={$url("./create")} class="btn bg-primary"><i class="fal fa-plus" /></a>
      {/if}
    </div>
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableTransaction bind:filter bind:loading />
    </div>
  </div>
  <slot />
</PageLayout>
