<script>
  import { onMount } from "svelte";
  import { TransactionInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import { debounce } from "@deboxsoft/module-core";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import Modal from "__@comps/Modal.svelte";

  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import FormJournalAccount from "./FormJournalAccount.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { filteringAccountDebit } from "../../../../utils";

  const { getTransactionType, transactionTypeStore } = stores.getTransactionContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const { authenticationStore } = getAuthenticationContext();
  const dispatch = createEventDispatcher();
  // props
  export let values = {};
  export let loading = false;
  export const title = "";

  let isValid = writable(false);
  let fieldsErrors;
  let fields, openDialog;
  let focusRef;

  onMount(() => {
    openDialog();
  });

  function getAccountDebit() {
    const accountStore = getAccountLeaf();
    return filteringAccountDebit(accountStore);
  }

  // handler
  function createUpdateAmountHandler() {
    return debounce((e) => {
      // debit = e.detail;
    });
  }

  function cancelHandler() {
    dispatch("cancel", values);
  }
</script>

<Modal {title} class="modal-full" bind:openDialog onClose={cancelHandler} initialFocusElement={focusRef}>
  <div class="d-flex flex-column flex-1">
    <Form
      checkValidateFirst
      schema={TransactionInputSchema}
      bind:fieldsErrors
      bind:fields
      {isValid}
      bind:values
      on:submit
    >
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="form-group col-md-6">
              <label for="date">Tanggal</label>
              <InputDate
                id="date"
                name="date"
                class="form-control"
                placeholder="Tanggal"
                selected= {new Date()}
                disabled={values.status === "UNAPPROVED"}
              />
            </div>
            <div class="form-group col-md-6">
              <label for="no">No Bukti/kwitansi</label>
              <InputField id="no" name="no" type="text" class="form-control" placeholder="No" bind:ref={focusRef} />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-12">
              <label for="description">Diskripsi</label>
              <InputField
                id="description"
                name="description"
                type="text"
                class="form-control"
                placeholder="Diskripsi"
              />
            </div>
          </div>
          <div class="row">
            <!--        <div class="form-group col-md-6">-->
            <!--          <div style="margin-bottom: 0.5rem;">Jenis Transaksi</div>-->
            <!--          <AutoComplete-->
            <!--            id="transaction-type"-->
            <!--            name="type"-->
            <!--            inputClassName="form-control"-->
            <!--            pristineValue={values.type || 'JOURNAL'}-->
            <!--            items={$transactionTypeStore}-->
            <!--            placeholder="jenis transaksi"-->
            <!--            valueFieldName="code"-->
            <!--            keywordsFieldName="name"-->
            <!--            labelFieldName="name" />-->
            <!--        </div>-->
            <div class="form-group col-md-6">
              <label for="accountId">Debit</label>
              <AccountSelect id="accountId" accountStore={getAccountDebit()} allowEmpty />
            </div>
            <div class="form-group col-md-6">
              <label for="amount">Jumlah</label>
              <InputRp id="amount" class="form-control" name="amount" signed on:input={createUpdateAmountHandler()} />
            </div>
          </div>
        </div>
        <div class="card-footer d-flex">
          <div class="flex-grow-1">&nbsp;</div>
          <div>
            <button
              type="button"
              class="btn btn-outline bg-primary text-primary border-primary"
              on:click={cancelHandler}
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary ml-1" disabled={!$isValid || loading}>
              <SaveIcon class="mr-2" disable={loading} />
              Save
            </button>
          </div>
        </div>
      </div>
      <FormJournalAccount />
    </Form>
  </div>
</Modal>
