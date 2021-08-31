<script>
  import InventoryTable from "../_components/InventoryTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Button from "../../../components/Button.svelte";
  import { getApplicationContext } from "../../../modules/app";
  import { Container } from "@deboxsoft/module-core";
  import { url } from "@roxi/routify";

  const inventoryContext = Container.get("inventory");
  inventoryContext.sync = fetchData;
  const applicationContext = getApplicationContext();
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "dashboard" });
  const { loading } = applicationContext;
  const { findPage, inventoryStore, inventoryPageInfo } = stores.getInventoryContext();

  let submitting = false,
    filter = {};

  fetchData();
  function fetchData(options = {}) {
    $loading;
    submitting = true;
    findPage(
      {
        filter,
        pageCursor: {
          next: options.more && $inventoryPageInfo?.next
        }
      },
      options
    ).then(() => {
      $loading = false;
      submitting = false;
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
  }
</script>

<div class="card d-flex flex-1 flex-column">
  <div class="card-body d-flex flex-1 flex-column">
    <InventoryTable {inventoryStore}>
      {#if $inventoryPageInfo.hasNext}
      <div class="" style="height: 50px">
        <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
        ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
        </Button>
      </div>
      {/if}
    </InventoryTable>
  </div>
</div>
<slot />
