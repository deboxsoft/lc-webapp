<script lang="ts">
  import type { TransactionInput } from "@deboxsoft/accounting-api";

  import { transactionSchema } from "@deboxsoft/accounting-api";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";
  import AutoComplete from "__@comps/forms/AutoCompleteField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { createEventDispatcher } from "svelte";
  import FormJournalAccount from "./FormJournalAccount.svelte";

  const { getTransactionType, transactionTypeStore } = getTransactionContext();
  const dispatch = createEventDispatcher();
  // props
  export let values: Partial<TransactionInput> = {};
  export let loading: boolean = false;

  // handler
  function cancelHandler() {
    dispatch("cancel", values);
  }
</script>

<Form schema={transactionSchema} {values} on:submit>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-md-4">
          <label for="date">Tanggal</label>
          <DatePickr id="date" name="date" class="form-control" placeholder="Tanggal" />
        </div>
        <div class="form-group col-md-4">
          <label for="no">No</label>
          <InputField id="no" name="noJournal" type="text" class="form-control" placeholder="No" />
        </div>
        <div class="form-group col-md-4">
          <label for="no-transaction">No Transaksi</label>
          <InputField
            id="no-transaction"
            name="noTransaction"
            type="text"
            class="form-control"
            placeholder="No Transaksi" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-md-6">
          <div style="margin-bottom: 0.5rem;">Jenis Transaksi</div>
          <AutoComplete
            id="transaction-type"
            name="type"
            inputClassName="form-control"
            pristineValue={values.type || 'JOURNAL'}
            items={$transactionTypeStore}
            placeholder="jenis transaksi"
            valueFieldName="code"
            keywordsFieldName="name"
            labelFieldName="name" />
        </div>
        <div class="form-group col-md-6">
          <label for="accountId">Account</label>
          <AccountSelect id="accountId" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="description">Diskripsi</label>
          <InputField id="description" name="description" type="text" class="form-control" placeholder="Diskripsi" />
        </div>
      </div>
    </div>
    <div class="card-footer d-flex">
      <div class="flex-grow-1">&nbsp;</div>
      <div>
        <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary ml-1" disabled={loading}>
          <SaveIcon class="mr-2" disable={loading} />
          Save
        </button>
      </div>
    </div>
  </div>
  <FormJournalAccount />
</Form>
