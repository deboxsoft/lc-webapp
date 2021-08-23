<script>
  import CategoryInventoryTable from "../_components/CategoryInventoryTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { Container } from "@deboxsoft/module-core";
  import { getApplicationContext } from "../../../modules/app";

  const applicationContext = getApplicationContext();
  const inventoryContext = Container.get("inventory");
  inventoryContext.sync = fetchData;
  const { loading } = applicationContext;
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
  console.log("layout");
</script>

<div class="card d-flex flex-1 flex-column">
  <div class="card-body d-flex flex-1 flex-column">
    <CategoryInventoryTable {categoryInventoryStore} />
  </div>
</div>
<slot />
