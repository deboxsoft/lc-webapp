<!--routify:options title="Edit Data Barang"-->
<script>
  import { ProductUpdateSchema as schema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import ProductForm from "../_components/ProductForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";
  import Modal from "__@comps/Modal.svelte";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { productContext } = stores.getStockContext();
  const { productStore, getProduct, update } = productContext;

  let product,
    openDialog,
    fields,
    submitting = false,
    ready = false,
    isValid;

  $: {
    if (!ready && openDialog && $productStore) {
      ready = true;
      product = getProduct($params.id);
      if (product) {
        openDialog();
      }
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await update(product.id, input);
      closeHandler();
      notify(`Berhasil mengedit data barang '${product.name}'`, "success");
    } catch (error) {
      console.error(error);
      notify(error.message, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "../");
  }
</script>

<Modal bind:openDialog title="Edit Data Persediaan" onClose={closeHandler} loading={!product}>
  <ProductForm {schema} {product} isUpdate bind:isValid bind:fields />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
