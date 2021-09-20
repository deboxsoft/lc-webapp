<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";

  import { goto } from "@roxi/routify";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import Modal from "../../../../components/Modal.svelte";

  const { notify, loading } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const { programStore } = getProgramContext();
  const dispatch = createEventDispatcher();
  const accounts = getAccountLeaf();

  // props
  export let cashier;
  export let onSubmit;
  export let isUpdate = false;
  export let title;
  export let schema;
  export let to = "./";
  let openDialog,
    fields,
    fieldsErrors,
    submitting = false,
    isValid = writable(false),
    creditAccountsStore = writable(cashier.creditAccounts.map((_) => ({ ..._, ...createCreditAccount() })));

  onMount(() => {
    openDialog();
  });

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await onSubmit(input);
      closeHandler();
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
  function createCreditAccount() {
    return { index: generateId({ prefix: "account-input", size: 3 }) };
  }

  function addJournalAccountHandler() {
    $creditAccountsStore = [...$creditAccountsStore, createCreditAccount()];
    $fields.creditAccounts = $creditAccountsStore;
    // accountsValidate($creditAccountsStore);
  }

  function updateJournalAccountHandler(input) {
    const i = $creditAccountsStore.findIndex((_) => _.index === input.index);
    $creditAccountsStore[i] = input;
    $fields.creditAccounts = $creditAccountsStore;
    // accountsValidate($creditAccountsStore);
  }

  function removeJournalAccountHandler(index) {
    let inputs = $creditAccountsStore;
    inputs = inputs.filter((_) => _.index !== index);
    $creditAccountsStore = inputs;
    $fields.creditAccounts = $creditAccountsStore;
    // accountsValidate($creditAccountsStore);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler} class="modal-lg">
  <Form checkValidateFirst {schema} values={cashier} bind:fields bind:fieldsErrors bind:isValid>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="purchaseDate">Tanggal</label>
            <InputDate
              id="date"
              name="date"
              class="form-control"
              placeholder="Tanggal"
              value="{new Date()},"
              range=""
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="name">No Bukti/kwitansi</label>
            <InputField id="no" name="no" type="text" class="form-control" placeholder="No Bukti/kwitansi" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="categoryId">Program</label>
            <ComboxField
              id="programId"
              name="programId"
              class="form-control"
              items={$programStore}
              valueId="id"
              labelId="name"
              placeholder="Program"
            />
          </div>
        </div>
      </div>
      <div class="card-footer d-flex">
        <div class="flex-grow-1">&nbsp;</div>
        <div>
          <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary ml-1" disabled={!$loading}>
            <i class="icon-floppy-disks mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
    <div class="card flex-grow-1">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Pembayaran</th>
              <th class="text-center" style="width: 275px">Nominal</th>
              <th class="text-center" style="width: 40px" />
            </tr>
          </thead>
          <tbody>
            {#each $creditAccountsStore as creditAccountInput, index (creditAccountInput.index)}
              <FormJournalAccountItem
                {index}
                input={creditAccountInput}
                onRemoveJournalAccount={removeJournalAccountHandler}
                onUpdateJournalAccount={updateJournalAccountHandler}
              />
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <div class="flex-grow-1">
      <button type="button" class="btn btn-light" on:click={addJournalAccountHandler}>
        <i class="icon-plus2 mr-2" />
        Tambah Akun
      </button>
    </div>
  </svelte:fragment>
</Modal>
