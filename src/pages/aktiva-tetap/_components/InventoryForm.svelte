<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { goto } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import InputDate from "../../../components/forms/InputDateField.svelte";
  import InputRp from "../../../components/forms/InputNumberField.svelte";
  import InputField from "../../../components/forms/InputField.svelte";
  import ComboxField from "../../../components/forms/ComboxField.svelte";
  import Form from "../../../components/forms/Form.svelte";
  import AccountSelect from "../../../components/account/AccountSelect.svelte";
  import { getAuthenticationContext } from "../../../modules/users";
  import { filteringAccountCash, filteringAccountInventory } from "../../../utils";

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
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="date">Tanggal</label>
        <InputDate
          id="date"
          name="date"
          class="form-control"
          placeholder="Tanggal"
          range=""
          disabled
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
          disabled={isUpdate}
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="debitAccount">Akun Aktiva Tetap</label>
        <AccountSelect
          id="debitAccount"
          name="debitAccount"
          accountStore={getAccount("inventory")}
          accountId={inventory?.debitAccount}
          placeholder="Akun Aktiva Tetap"
          disabled={isUpdate}
          allowEmpty
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="creditAccount">Akun Pembayaran</label>
        <AccountSelect
          id="creditAccount"
          name="creditAccount"
          accountStore={getAccount("cash")}
          accountId={inventory?.creditAccount}
          placeholder="Akun Pembayaran"
          disabled={isUpdate}
          allowEmpty
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="quantity">Jumlah</label>
        <InputField
          id="quantity"
          name="quantity"
          class="form-control"
          type="number"
          placeholder="Jumlah"
          disabled={isUpdate}
        />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="priceItem">Harga</label>
        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Harga" disabled={isUpdate} />
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
