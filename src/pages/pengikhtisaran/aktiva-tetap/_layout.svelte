<!--routify:options title="Aktiva Tetap"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableAktivaTetap from "./_components/TableAktivaTetap.svelte";

  const { setBreadcrumbContext } = getBreadcrumbStore();

  setBreadcrumbContext({ path: $url("./"), title: "aktiva tetap" });

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">

  </div>
  <div class="card d-flex flex-1 flex-column">
    <TableAktivaTetap />
  </div>
</PageLayout>
<slot />
