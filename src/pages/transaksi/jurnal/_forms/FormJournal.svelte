<script>
  import { onMount, tick, createEventDispatcher } from "svelte";
  import { TransactionInputSchema, getLimitDate } from "@deboxsoft/accounting-api";
  import { generateId } from "@deboxsoft/module-client";
  import { stores } from "@deboxsoft/accounting-client";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import Modal from "__@comps/Modal.svelte";

  import FormJournalAccount from "./FormJournalAccount.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  // import { filteringAccountDebit, filteringAccountCredit } from "__@root/utils";
  import { getApplicationContext } from "__@modules/app";
  import InputCheckSwitchery from "__@comps/forms/InputCheckSwitchery.svelte";

  const { getTransactionType, transactionTypeStore } = stores.getTransactionContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const { authenticationStore } = getAuthenticationContext();
  const { loading } = getApplicationContext();
  const dispatch = createEventDispatcher();
  // props
  export let values;
  export let title = "";

  let isValid, fieldsErrors, fields, openDialog, focusRef, buttonSaveDisable, accountStore, startDate, endDate;

  onMount(() => {
    openDialog();
  });

  $: {
    accountStore = getAccountLeaf();
    // if ($fields?.isCredit) {
    //   accountStore = filteringAccountCredit(_accounts);
    // } else {
    //   accountStore = filteringAccountDebit(_accounts);
    // }
  }

  $: {
    tick().then(() => {
      buttonSaveDisable = !$isValid || $loading;
    });
  }

  $: {
    if ($preferenceStore) {
      const limitDate = getLimitDate($preferenceStore.period, $preferenceStore.startPeriodOnMonth);
      startDate = limitDate.start;
      endDate = limitDate.end;
    }
  }
  export function createCreditAccount() {
    return {
      index: generateId({ prefix: "account-credit", size: 3 })
    };
  }

  function cancelHandler() {
    dispatch("cancel", values);
  }
</script>

<Modal
  {title}
  class="modal-lg"
  bind:openDialog
  onClose={cancelHandler}
  initialFocusElement={focusRef}
  loading={!values}
>
  <div class="d-flex flex-column flex-1">
    <Form
      checkValidateFirst
      schema={TransactionInputSchema.omit({ dateApproved: 1, approveBy: 1 })}
      bind:fieldsErrors
      bind:fields
      bind:isValid
      {values}
      on:submit
    >
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="form-group col-md-6">
              <label for="date">Tanggal *</label>
              <InputDate
                id="date"
                name="date"
                class="form-control"
                placeholder="Tanggal *"
                selected={new Date()}
                disabled={values.status === "UNAPPROVED"}
                {startDate}
                {endDate}
              />
            </div>
            <div class="form-group col-md-6">
              <label for="no">No Bukti/kwitansi</label>
              <InputField id="no" name="no" type="text" class="form-control" placeholder="No" bind:ref={focusRef} />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-12">
              <label for="description">Deskripsi *</label>
              <InputField
                id="description"
                name="description"
                type="text"
                class="form-control"
                placeholder="Deskripsi *"
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
              <label for="accountId">Akun {$fields?.isCredit ? "Kredit" : "Debit"} *</label>
              <div class="d-flex">
                <AccountSelect class="mr-2" id="accountId" {accountStore} allowEmpty />
                <InputCheckSwitchery class="mt-auto mb-auto" name="isCredit" label="kredit" />
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="amount">Jumlah *</label>
              <InputRp id="amount" class="form-control" name="amount" signed />
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
            <button type="submit" class="btn btn-primary ml-1" disabled={buttonSaveDisable}>
              <SaveIcon class="mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
      {#if $fields}
        <FormJournalAccount {createCreditAccount} />
      {/if}
    </Form>
  </div>
</Modal>
