<script>
  import { z, ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // components
  import Modal from "__@comps/Modal.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCash } from "__@root/utils";
  import { stores } from "@deboxsoft/accounting-client";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";

  const { notify, loading } = getApplicationContext();
  const { preferenceStore, save: savePreference } = stores.getPreferenceAccountingContext();

  // props
  export let bank;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  export let schema;

  // state
  let openDialog,
    loadingMasterBank,
    fields,
    isValid = writable(false),
    fieldsErrors,
    bankList = [],
    submitting = false;

  onMount(() => {
    openDialog();
  });

  $: {
    if ($preferenceStore?.bank) {
      bankList = $preferenceStore.bank;
    }
  }

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "cash": {
        return filteringAccountCash(accountStore);
      }
    }
  }

  async function createMasterBankHandler(text) {
    try {
      const bank = z.array(z.string().min(1)).parse([text, ...$preferenceStore.bank]);
      const input = { ...$preferenceStore, bank }
      await savePreference(input);
    } catch (e) {
      console.error(e);
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      await onSubmit($fields);
      $goto(to);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        $fieldsErrors = error.flatten().fieldErrors;
        // remap field
        let fieldName;
        if ($fieldsErrors.name) {
          fieldName = "nama";
        } else if ($fieldsErrors.nameAccountBank) {
          fieldName = "nama rekening";
        } else if ($fieldsErrors.noAccountBank) {
          fieldName = "no rekening";
        } else if ($fieldsErrors.accountId) {
          fieldName = "akun rekening";
        }
        notify(`${fieldName} ${error.errors[0].message}`, "error");
      }
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={bank} bind:fields bind:fieldsErrors bind:isValid>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-6">
            <label for="bank">Pilih Bank</label>
            <AutoCompleteField
              inputClassName="form-control"
              id="bank"
              items={bankList}
              name="name"
              create
              createText="tambahkan sebagai data baru"
              placeholder="Pilih Bank"
              onCreate={createMasterBankHandler}
            />
          </div>
          <div class="form-group col-6">
            <label for="branch">Cabang</label>
            <InputField id="branch" name="branch" type="text" class="form-control" placeholder="Cabang" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-6">
            <label for="accountBank">No Rekening</label>
            <InputField
              id="accountBank"
              name="noAccountBank"
              type="text"
              class="form-control"
              placeholder="No Rekening"
            />
          </div>
          <div class="form-group col-6">
            <label for="nameAccountBank">Nama Rekening</label>
            <InputField
              id="nameAccountBank"
              name="nameAccountBank"
              type="text"
              class="form-control"
              placeholder="Nama Rekening"
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="account">Akun Bank</label>
            <AccountSelect id="account" name="accountId" allowEmpty />
          </div>
        </div>
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
