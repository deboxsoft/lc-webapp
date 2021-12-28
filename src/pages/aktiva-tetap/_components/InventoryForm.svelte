<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { filteringAccountCash, filteringAccountInventory } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { authenticationStore } = getAuthenticationContext();
  const { categoryInventoryStore, getCategoryInventory } = stores.getInventoryContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const dispatch = createEventDispatcher();

  // props
  export let inventory;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  export let schema;

  // state
  let openDialog,
    fields,
    isValid,
    fieldsErrors,
    submitting = false;

  onMount(() => {
    openDialog();
  });

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "inventory": {
        return filteringAccountInventory(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      await onSubmit(schema.parse($fields));
      $goto(to);
    } catch (error) {
      console.error(error);
      notify(`${error.path[0]} ${error.message}`, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={{ ...inventory }} bind:fields bind:fieldsErrors bind:isValid>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="date">Tanggal Perolehan</label>
        <InputDate id="datePurchase" name="datePurchase" class="form-control" placeholder="Tanggal Perolehan" range={false} />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="code">No Nota</label>
        <InputField id="no" name="no" type="text" class="form-control" placeholder="No Nota" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="categoryId">Kategori</label>
        <ComboxField
          id="categoryId"
          name="categoryId"
          class="form-control"
          items={$categoryInventoryStore}
          valueId="id"
          labelId="name"
          placeholder="Kategori"
          disabled={isUpdate}
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="supplier">Supplier</label>
        <InputField id="supplier" name="supplier" type="text" class="form-control" placeholder="Supplier" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="condition">Kondisi</label>
        <InputField id="condition" name="condition" type="text" class="form-control" placeholder="Kondisi" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="location">Lokasi</label>
        <InputField id="location" name="location" type="text" class="form-control" placeholder="Lokasi" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="person">Penanggung Jawab</label>
        <InputField id="person" name="person" type="text" class="form-control" placeholder="Penanggung Jawab" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="creditAccount">Pembayaran</label>
        <AccountSelect
          id="creditAccount"
          name="creditAccount"
          accountStore={getAccount("cash")}
          accountId={inventory?.creditAccount}
          placeholder="Pembayaran"
          disabled={isUpdate}
          allowEmpty
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="quantity">Nominal</label>
        <InputField id="quantity" name="quantity" class="form-control" placeholder="Nominal" disabled={isUpdate} />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="priceItem">Harga Satuan</label>
        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Harga Satuan" disabled={isUpdate} />
      </div>
    </div>
  </Form>
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
