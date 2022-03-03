<script>
  import { groupDepreciation } from "@deboxsoft/accounting-api";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import {
    filteringAccountAccumulationDepreciation,
    filteringAccountExpenseDepreciation,
    filteringAccountInventory,
    filteringAccountPayable
  } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { categoryInventoryStore } = stores.getInventoryContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const accounts = getAccountLeaf();

  const depreciationMethods = [{ id: "STRAIGHT_LINE", label: "Garis Lurus" }];

  // props
  export let categoryInventory;
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
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "expense": {
        return filteringAccountExpenseDepreciation(accountStore);
      }
      case "accumulation": {
        return filteringAccountAccumulationDepreciation(accountStore);
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
  <Form checkValidateFirst {schema} values={{ ...categoryInventory }} bind:fields bind:fieldsErrors bind:isValid>
    <div class="row">
      <div class="form-group col-12">
        <label for="name">Nama *</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama *" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="depreciationMethod">Kelompok Depresiasi *</label>
        <ComboxField
          id="depreciationGroup"
          name="groupDepreciationId"
          class="form-control"
          items={groupDepreciation}
          placeholder="Kelompok Depresiasi *"
          disabled={isUpdate}
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="expenseDepreciationAccount">Biaya Penyusutan Aktiva Tetap *</label>
        <AccountSelect
          id="expenseDepreciationAccount"
          name="expenseDepreciationAccount"
          accountStore={getAccount("expense")}
          accountId={categoryInventory?.expenseDepreciationAccount}
          placeholder="Biaya Penyususan Aktiva Tetap *"
          allowEmpty
          disabled={isUpdate}
        />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="accumulatedDepreciationAccount">Akumulasi Penyusutan Aktiva Tetap *</label>
        <AccountSelect
          id="accumulatedDepreciationAccount"
          name="accumulatedDepreciationAccount"
          accountStore={getAccount("accumulation")}
          accountId={categoryInventory?.accumulatedDepreciationAccount}
          placeholder="Akumulasi Penyusutan Aktiva Tetap *"
          allowEmpty
          disabled={isUpdate}
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
