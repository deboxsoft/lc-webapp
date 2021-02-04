<!--routify:options title="tabel"-->
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

<PageLayout>
  <div class="header-elements" slot="header-elements">
  </div>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Buku Besar</h5>
      <div class="header-elements">
        <!--        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>-->
      </div>
    </div>
    <div class="dataTables_scrollBody">
      <Table />
    </div>
  </div>
</PageLayout>
