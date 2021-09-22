<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { filteringAccountStock } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { supplierStore } = stores.getSupplierContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const accounts = getAccountLeaf();


  // props
  export let supplier;
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

  function getAccount() {
    const accountStore = getAccountLeaf();
    return filteringAccountStock(accountStore);
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
    values={{ ...supplier }}
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
        <label for="address">Alamat</label>
        <InputField id="address" name="address" type="text" class="form-control" placeholder="Alamat" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="phone">No Telp</label>
        <InputField id="phone" name="phone" type="text" class="form-control" placeholder="No Hp" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="email">Email</label>
        <InputField id="email" name="email" type="text" class="form-control" placeholder="Email" />
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
