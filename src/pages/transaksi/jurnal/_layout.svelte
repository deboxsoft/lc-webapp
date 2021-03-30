<!--routify:options title="Jurnal Umum"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import PlusIcon from "__@comps/icons/Plus.svelte"
  import TableJournal from "./_tables/TableJournal.svelte";
  import { createTransactionContext, getTransactionContext } from "__@modules/accounting";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  createTransactionContext();
  const { transactionStore, load } = getTransactionContext();
  let loading = true;
  load().then(() => {
    loading = false;
  });
</script>
<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./create')} class="btn bg-primary"><PlusIcon class="mr-2" />Tambah</a>
  </div>
  <!--  <ul slot="navbar-second" class="navbar-nav">-->
  <!--    <li class="nav-item">-->
  <!--      <a href={$url('./post')} class="navbar-nav-link "><PlusIcon class="mr-2 -size-small" />Tambah</a>-->
  <!--    </li>-->
  <!--  </ul>-->
  <div class="card h-100">
    <div class="card-header header-elements-inline">
      <!--      <h5 class="card-title">Jurnal</h5>-->
      <div class="header-elements">

        <!--        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>-->
      </div>
    </div>
    <!--    <div class="card-body">-->
    <!--    </div>-->
    <TableJournal />
  </div>
</PageLayout>
<slot />
