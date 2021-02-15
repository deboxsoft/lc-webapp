<!--routify:options title="tabel"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PlusIcon from "__@comps/icons/Plus.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_comps/TableReconciliation.svelte";

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./form')} class="btn bg-primary"><PlusIcon class="mr-2" />Tambah Akun Bank</a>
  </div>
  <div class="card">
    <div class="card-body">
      <Table />
    </div>
  </div>
</PageLayout>
