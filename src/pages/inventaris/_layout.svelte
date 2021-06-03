<!--routify:options title="Inventaris"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Table from "./_components/TableInventory.svelte";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";

  const { readGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  stores.createInventoryContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "inventaris" });
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="list-icons">
      <a href={$url("./create")} class="btn btn-primary btn-icon"><i class=icon-plus2 /></a>
    </div>
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      <Table />
    </div>
  </div>
</PageLayout>
<slot />
