<!--routify:options title="Barang Masuk"-->
<script>
  import { StockOutInputSchema as schema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import StockForm from "./_components/StockForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import { getAuthenticationContext } from "__@modules/users";
  import Modal from "__@comps/Modal.svelte";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { out: submit, stockStore, getStock } = stores.getStockContext();
  const { getUserId } = getAuthenticationContext();
  const { loading, notify } = getApplicationContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let openDialog,
    fieldsErrors,
    addProductStock,
    fields,
    isValid,
    submitting = false,
    stock,
    defaultProduct = {},
    ready = false;

  $: {
    if (openDialog && !ready && stock) {
      openDialog();
    }
  }
  init();
  function init() {
    const userId = getUserId();
    const currentDatePromise = getCurrentDate().then((date) => {
      stock = {
        date,
        userId,
        products: [defaultProduct]
      };
    });
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await submit(input);
      closeHandler();
      notify(`Barang keluar berhasil diupdate`, "success");
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

<Modal class="modal-lg" bind:openDialog title="Form Barang Keluar" onClose={closeHandler} loading={!stock}>
  <StockForm
    {stock}
    {schema}
    mutation="STOCK_OUT"
    bind:fields
    bind:isValid
    bind:fieldsErrors
    bind:addProductStock
  />
  <svelte:fragment slot="footer">
    <div class="flex-grow-1">
      <button type="button" class="btn btn-light" on:click={() => addProductStock()}>
        <ListPlusIcon class="mr-2" />
        Tambah Barang
      </button>
    </div>
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
