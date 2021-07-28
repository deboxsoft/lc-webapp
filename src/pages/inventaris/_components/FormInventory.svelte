<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { InventoryInputSchema } from "@deboxsoft/accounting-api";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { notify, loading } = getApplicationContext();
  const { categoryInventoryStore } = stores.getInventoryContext();
  const dispatch = createEventDispatcher();

  // props
  export let inventory;
  export const isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";

  // state
  let state = "prepare";
  let openDialog;
  let fields;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);

  onMount(() => {
    openDialog();
  })

  async function submitHandler() {
    try {
      state = "submitting"
      $loading = true;
      await onSubmit($fields);
      $loading = false;
      state = "success"
      $goto(to);
    } catch (error) {
      state = "failed";
      notify(`${error.errors[0].message}`, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    state = "close"
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form schema={InventoryInputSchema}  values={inventory} bind:fields bind:submitted>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="purchaseDate">Tanggal Pembelian</label>
        <InputDate
          id="purchaseDate"
          name="purchaseDate"
          class="form-control"
          placeholder="Tanggal Pembelian"
          value={new Date()},
          range=""
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="categoryId">Kategori</label>
        <ComboxField
          id="categoryId"
          name="categoryId"
          class="form-control"
          items={$categoryInventoryStore}
          valueId="id"
          labelId="name"
          placeholder="Kategori"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="creditAccount">Akun Kredit</label>
        <AccountSelect id="creditAccount" name="creditAccount" placeholder="Akun Kredit" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="quantity">Jumlah</label>
        <InputField id="quantity" name="quantity" class="form-control" type="number" placeholder="Jumlah" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="priceItem">Harga</label>
        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Harga" />
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={$loading} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
