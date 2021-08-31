<script>
  import CategoryInventoryTable from "../_components/CategoryInventoryTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { Container } from "@deboxsoft/module-core";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "../../../modules/app";
  import { url } from "@roxi/routify";

  const applicationContext = getApplicationContext();
  const inventoryContext = Container.get("inventory");
  inventoryContext.sync = fetchData;
  const { loading } = applicationContext;
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "kategori" });
  const { findCategory, categoryInventoryStore } = stores.getInventoryContext();

  let submitting = false,
    filter = {};

  fetchData();

  function fetchData() {
    $loading;
    submitting = true;
    findCategory().then(() => {
      $loading = false;
      submitting = false;
    });
  }
</script>

<div class="card d-flex flex-1 flex-column">
  <div class="card-body d-flex flex-1 flex-column">
    <CategoryInventoryTable {categoryInventoryStore} />
  </div>
</div>
<slot />
