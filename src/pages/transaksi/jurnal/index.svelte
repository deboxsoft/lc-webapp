<!--routify:options title="Jurnal Umum"-->
<script lang="ts">
  import { url, ready } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import AddTaskRoundedIcon from "@deboxsoft/svelte-icons/AddTaskRounded.svelte";
  import { getTransactionContext } from "__@modules/transaksi/jurnal";

  const { transactionStore, findTransaction } = getTransactionContext();

  findTransaction().then($ready);

</script>

<PageLayout>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./post')} class="btn btn-link btn-float text-default">
      <Icon class="text-primary" size="large" component={AddTaskRoundedIcon} />
      <span>Transaksi Baru</span></a>
  </div>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Jurnal</h5>
      <div class="header-elements">
        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>
      </div>
    </div>
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <table class="table table-togglable table-hover">
          <thead>
            <tr>
              <th class="fit">No Transaksi</th>
              <th class="fit">Tanggal</th>
              <th>Deskripsi</th>
              <th class="fit">Total</th>
            </tr>
          </thead>
          <tbody>
            <!--{#each $transactionStore as transaction}-->
            <!--  <tr>-->
            <!--    <td>{transaction.noTransaction}</td>-->
            <!--    <td>{transaction.date}</td>-->
            <!--    <td>{transaction.description}</td>-->
            <!--    <td>{transaction.total}</td>-->
            <!--  </tr>-->
            <!--{/each}-->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</PageLayout>
