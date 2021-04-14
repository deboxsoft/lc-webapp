<script>
  import { goto, params } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";

  $: url = $params.backUrl || "./"

  async function saveHandler() {
    // await save(accountId);
    $goto(url, {}, true);
  }

  function closeHandler() {
    $goto(url, {}, true);
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
<!--    <a href={$url('./create')} class="btn bg-primary"><PlusIcon class="mr-2" />Tambah</a>-->
  </div>
  <div class="card">
    <!--    <div class="card-header header-elements-inline">-->
    <!--    </div>-->
    <div class="card-body">
      <div class="dataTables_scrollBody">
<!--        <TableAccount />-->
      </div>
    </div>
  </div>
</PageLayout>