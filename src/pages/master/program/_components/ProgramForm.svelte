<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { onMount } from "svelte";
  import { ProgramInputSchema } from "@deboxsoft/lc-cashier-api";
  import { writable } from "svelte/store";

  // components
  import Modal from "../../../../components/Modal.svelte";
  import InputField from "../../../../components/forms/InputField.svelte";
  import Form from "../../../../components/forms/Form.svelte";
  import InputNumberField from "../../../../components/forms/InputNumberField.svelte";

  // context
  const { notify } = getApplicationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const { programStore, getProgram } = getProgramContext();

  // filtering account type
  export let program = {}
  export let programList = {};
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "../";
  let openDialog;
  let loading = false;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);
  let tabSelect = 1;
  let codeState = "";
  let fields = writable({});
  let _autoCode = false;
  let _tmpId = "";
  let _tmpIdAsParent = "";
  let _parentIdTmp = "";
  let _typeTmp;


  onMount(() => {
    openDialog();
  });


  async function submitHandler(e) {
    loading = true;
    try {
      await onSubmit($fields);
      loading = false;
      closeHandler();
    } catch (error) {
      if (error instanceof ZodError) {
        $fieldsErrors = error.flatten().fieldErrors;
        notify(
          `${pathsError[error.errors[0].path[0]] || error.errors[0].path[0]}: ${error.errors[0].message}`,
          "error"
        );
      }
      loading = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }


  function keyHandler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  }
</script>

<Modal {title} onClose={closeHandler} bind:openDialog>
  <Form
    {submitted}
    {fieldsErrors}
    bind:fields
    ignoreAttribs={[]}
    schema={ProgramInputSchema}
    values={program}
  >
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-12">
            <label for="name">Nama</label>
            <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" on:keypress={keyHandler} />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="discount">Diskon</label>
            <InputField id="discount" name="discount" type="text" class="form-control" placeholder="Diskon" on:keypress={keyHandler} />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="amount">Nominal</label>
            <InputNumberField id="amount" class="form-control" name="amount" signed />
          </div>
        </div>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Batal
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
