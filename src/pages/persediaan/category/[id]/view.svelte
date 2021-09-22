<!--routify:options title="Detail Kategori Barang"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryProductView from "../_components/CategoryProductView.svelte";

  const { getCategoryProduct, categoryProductStore } = stores.getCategoryProductContext();

  let openDialog, categoryProduct;

  $: {
    if ($categoryProductStore && openDialog) {
      categoryProduct = getCategoryProduct($params.id);
      if (categoryProduct) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Kategori Barang" bind:openDialog onClose={closeHandler}>
  <CategoryProductView {categoryProduct} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
