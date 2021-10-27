<script>
  import { createProgramContext} from "@deboxsoft/lc-cashier-client";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import CashierPaymentForm from "./CashierPaymentForm.svelte";
  import { tick } from "svelte";

  const applicationContext = getApplicationContext();
  const { notify, loading } = applicationContext;
  const { getAccountLeaf } = stores.getAccountContext();
  const { programStore, findPage: findProgramContext } = createProgramContext(applicationContext);
  const accounts = getAccountLeaf();

  export function createCreditAccount() {
    return { index: generateId({ prefix: "account-input", size: 3 }) };
  }

  // props
  export let cashier;
  export let schema;
  export let isUpdate = false;
  export let fields;
  export let fieldsErrors;
  export let isValid;
  export let focusRef;

  let buttonSaveDisable;


  $: {
    if (!$programStore) {
      findProgramContext({pageCursor: {}, filter: {}}, {})
    }
  }

  $: {
    tick().then(() => {
      buttonSaveDisable = !$isValid || $loading;
    });
  }
</script>

<Form checkValidateFirst {schema} values={cashier} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      <div class="row">
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
        <div class="form-group col-12 col-md-6">
          <label for="name">No Bukti/kwitansi</label>
          <InputField id="no" name="no" type="text" class="form-control" placeholder="No Bukti/kwitansi" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="categoryId">Program</label>
          <ComboxField
            id="programId"
            name="programId"
            class="form-control"
            items={$programStore}
            valueId="id"
            labelId="name"
            placeHolder="Program"
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="student">Nama Siswa</label>
          <InputField id="student" name="student" class="form-control" placeholder="Nama Siswa" bind:ref={focusRef} />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="description">Keterangan</label>
          <InputField id="description" name="description" class="form-control" placeholder="Keterangan" bind:ref={focusRef} />
        </div>
      </div>
    </div>
  </div>
  {#if $fields}
    <CashierPaymentForm {createCreditAccount} />
  {/if}
</Form>
