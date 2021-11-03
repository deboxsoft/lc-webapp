<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCash, filteringAccountExpense, filteringAccountStock } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { categoryProductStore } = stores.getCategoryProductContext();
  const { getAccountLeaf, accountStore } = stores.getAccountContext();
  const accounts = getAccountLeaf();


  // props
  export let categoryProduct;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  export let schema;

  // state
  let openDialog,
    fields,
    isValid = writable(false),
    fieldsErrors,
    submitting = false;

  onMount(() => {
    openDialog();
  });

  function getAccount(accountType) {
    switch (accountType) {
      case "stock": {
        return filteringAccountStock(accountStore);
      }
      case "expense": {
        return filteringAccountExpense(accountStore);
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
  <Form
    checkValidateFirst
    {schema}
    values={{ ...categoryProduct }}
    bind:fields
    bind:fieldsErrors
    bind:isValid
  >
    <div class="row">
      <div class="form-group col-12">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="accountId">Akun Persediaan</label>
        <AccountSelect
          id="accountId"
          name="accountId"
          accountStore={getAccount("stock")}
          accountId={categoryProduct?.accountId}
          placeholder="AkunPersediaan"
          allowEmpty
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="expenseAccount">Akun Biaya Persediaan</label>
        <AccountSelect
          id="expenseAccount"
          name="expenseAccount"
          placeholder="Akun Biaya Persediaan"
          allowEmpty
          accountStore={getAccount("expense")}
          accountId={categoryProduct?.expenseAccount}
        />
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
