<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import PlusIcon from "__@comps/icons/Plus.svelte";
  import TableAccount from "./_tables/TableAccount.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";

  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "akun-perkiraan" });

</script>
<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./create')} class="btn bg-primary"><PlusIcon class="mr-2" />Tambah</a>
  </div>
  <div class="card">
    <!--    <div class="card-header header-elements-inline">-->
    <!--    </div>-->
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <TableAccount />
      </div>
    </div>
  </div>
</PageLayout>
<slot />
