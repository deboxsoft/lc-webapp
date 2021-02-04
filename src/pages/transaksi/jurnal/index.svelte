<!--routify:options title="tabel"-->
<script lang="ts">
  import { url, ready } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import PlusIcon from "__@comps/icons/Plus.svelte"
  import AddTaskRoundedIcon from "@deboxsoft/svelte-icons/AddTaskRounded.svelte";
  import { getTransactionContext } from "__@modules/transaksi/jurnal";
  import Table from "./_tables/Table.svelte";

  const { transactionStore, findTransaction } = getTransactionContext();

  findTransaction().then($ready);

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./post')} class="btn bg-blue"><PlusIcon class="mr-2" />Tambah</a>
  </div>
  <!--  <ul slot="navbar-second" class="navbar-nav">-->
  <!--    <li class="nav-item">-->
  <!--      <a href={$url('./post')} class="navbar-nav-link "><PlusIcon class="mr-2 -size-small" />Tambah</a>-->
  <!--    </li>-->
  <!--  </ul>-->
  <div class="card">
    <div class="card-header header-elements-inline">
<!--      <h5 class="card-title">Jurnal</h5>-->
      <div class="header-elements">

        <!--        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>-->
      </div>
    </div>
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <Table />
      </div>
    </div>
  </div>
</PageLayout>
