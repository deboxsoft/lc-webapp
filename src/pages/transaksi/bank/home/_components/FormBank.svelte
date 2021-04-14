<script lang="ts">
  import type { BankReconciliationInput } from "@deboxsoft/accounting-api";

  import { BankReconciliationInputSchema } from "@deboxsoft/accounting-api";
  import { createEventDispatcher } from "svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { getReconciliationContext } from "__@modules/accounting";

  const { bankReconciliationStore } = getReconciliationContext();
  const dispatch = createEventDispatcher();

  // props
  export let values: Partial<BankReconciliationInput>;
  export let loading: boolean = false;

  function cancelHandler() {
    dispatch("cancel", values);
  }
</script>

<Form schema={BankReconciliationInputSchema} {values} on:submit>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="bank">Nama Bank</label>
          <InputField id="bank" name="bank" type="text" class="form-control" placeholder="Nama Bank" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="accountBank">No Akun Bank</label>
          <InputField id="accountBank" name="accountBank" type="text" class="form-control" placeholder="Akun Bank" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="nameAccountBank">Nama Akun Bank</label>
          <InputField
            id="nameAccountBank"
            name="nameAccountBank"
            type="text"
            class="form-control"
            placeholder="Nama Akun Bank" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="account">Akun</label>
          <AccountSelect />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-md-6">
          <label for="balance">Saldo Terakhir</label>
          <InputNumberField id="balance" name="balance" class="form-control" signed={false} />
        </div>
        <div class="form-group col-md-6">
          <label for="date">Tanggal</label>
          <InputDateField id="date" name="date" class="form-control" placeholder="Tanggal" />
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
          <SaveIcon class="mr-2" />
          Save
        </button>
      </div>
    </div>
  </div>
</Form>
