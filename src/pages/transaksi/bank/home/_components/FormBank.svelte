<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { BankInputSchema } from "@deboxsoft/accounting-api";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { getBankContext } from "__@modules/accounting";

  // components
  import Modal from "__@comps/Modal.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  const { notify } = getApplicationContext();
  const { bankStore } = getBankContext();
  const dispatch = createEventDispatcher();

  // props
  export let bank;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  let fields;
  let loading = false;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);


  async function submitHandler(e) {
    loading = true;
    try {
      BankInputSchema.parse($fields);
      await onSubmit($fields);
      loading = false;
      $goto(to);
    } catch (error) {
      if (error instanceof ZodError) {
        if (error instanceof ZodError) {
          $fieldsErrors = error.flatten().fieldErrors;
          notify(
            `${error.errors[0].message}`,
            "error"
          );
        }
      }
      loading = false;
    }
  }

  function cancelHandler() {
    $goto(to)
  }
</script>

<Modal {title}>
  <Form schema={BankInputSchema} values={bank} bind:fields>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-6">
            <label for="bank">Nama Bank</label>
            <InputField id="bank" name="bank" type="text" class="form-control" placeholder="Nama Bank" />
          </div>
          <div class="form-group col-6">
            <label for="accountBank">No Rekening</label>
            <InputField id="accountBank" name="noAccountBank" type="text" class="form-control" placeholder="No Rekening" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
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
            <label for="account">Akun Perkiraan</label>
            <AccountSelect allowEmpty />
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
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
      <i class="fal fa-save mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
