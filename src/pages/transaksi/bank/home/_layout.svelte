<!--routify:options title="Bank"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_components/TableBank.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "bank" });

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./create')} class="btn btn-primary btn-icon"><i class="fal fa-plus" /></a>
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <Table />
    </div>
  </div>
</PageLayout>
<slot />
