<!--routify:options title="Posting Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import { ProductCreateSchema as schema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import ProductForm from "./_components/ProductForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Modal from "__@comps/Modal.svelte";

  const { notify, loading } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { productContext } = stores.getStockContext();
  const { create } = productContext;
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let product = {},
    openDialog,
    fields,
    submitting = false,
    isStartup = true,
    isValid;


  $: {
    if (openDialog && isStartup) {
      isStartup = false;
      openDialog();
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await create(input);
      closeHandler();
      notify(`Berhasil membuat data barang '${input.name}'.`, "success");
    } catch (error) {
      console.error(error);
      notify(error.message, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "./");
  }
</script>

<Modal bind:openDialog title="Membuat Data Persediaan" onClose={closeHandler} loading={!product}>
  <ProductForm {schema} {product} bind:isValid bind:fields />
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
