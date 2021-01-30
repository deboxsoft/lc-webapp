<!--routify:options title="Jurnal Umum"-->
<script lang="ts">
  import { url, ready } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import AddTaskRoundedIcon from "@deboxsoft/svelte-icons/AddTaskRounded.svelte";
  import { getTransactionContext } from "__@modules/transaksi/jurnal";
  import Table from "./_tables/Table.svelte";

  const { transactionStore, findTransaction } = getTransactionContext();

  findTransaction().then($ready);

</script>

<PageLayout breadcrumb={[]}>
<!--  <div class="header-elements" slot="header-elements">-->
<!--    <a href={$url('./post')} class="btn btn-link btn-float text-default">-->
<!--      <Icon class="text-primary" size="large" component={AddTaskRoundedIcon} />-->
<!--      <span>Transaksi Baru</span></a>-->
<!--  </div>-->
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Jurnal</h5>
      <div class="header-elements">
        <a href={$url('./post')} class="btn bg-blue"><i class="icon-add mr-2"></i>Tambah</a>

        <!--        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>-->
      </div>
    </div>
    <div class="dataTables_scrollBody">
      <Table />
    </div>
  </div>
</PageLayout>
