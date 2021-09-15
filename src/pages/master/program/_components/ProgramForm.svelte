<script>
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // components
  import Modal from "../../../../components/Modal.svelte";
  import InputField from "../../../../components/forms/InputField.svelte";
  import Form from "../../../../components/forms/Form.svelte";

  // context
  const { notify, loading } = getApplicationContext();
  const { programStore, getProgram } = getProgramContext();

  // props
  export let program;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let schema;
  export let to = "./";

  let openDialog,
    fields,
    fieldsErrors,
    submitting = false,
    isValid = writable(false);

  onMount(() => {
    openDialog();
  });

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await onSubmit(input);
      $loading = false;
      closeHandler();
    } catch (error) {
      console.error(error);
      notify(`${error.path[0]} ${error.message}`, "error");
    } finally {
      $loading = false;
      submitting = false;
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

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={program} bind:fields bind:fieldsErrors bind:isValid>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-12">
            <label for="name">Nama</label>
            <InputField
              id="name"
              name="name"
              type="text"
              class="form-control"
              placeholder="Nama"
              on:keypress={keyHandler}
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="period">Periode</label>
            <InputField
              id="period"
              name="period"
              type="text"
              class="form-control"
              placeholder="Periode"
              on:keypress={keyHandler}
            />
          </div>
        </div>
        <!--        <div class="row">-->
        <!--          <div class="form-group col-12">-->
        <!--            <label for="amount">Nominal</label>-->
        <!--            <InputNumberField id="amount" class="form-control" name="amount" signed />-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Batal
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
