<!--routify:options title="Buku Besar"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableAccountBalance from "./_components/TableAccountBalance.svelte";

  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Buku Besar" });

</script>

<PageLayout breadcrumb={[]}>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableAccountBalance />
    </div>
  </div>
</PageLayout>
