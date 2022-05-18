<script>
  import { stores } from "@deboxsoft/accounting-client";

  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboBox from "__@comps/forms/ComboxField.svelte";

  export let openDialog;
  export let closeDialog;
  export let onClose;
  export let params = {};
  export let onFilter = () => {};

  let values = params;

  function submitHandler() {
    params = values || {};
    onFilter();
    closeDialog();
  }
</script>

<Modal title="filter" bind:openDialog bind:onClose bind:closeDialog>
  <Form bind:values />

  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-primary ml-1" on:click={submitHandler}>
      <i class="icon-filter4 mr-2" />
      Filter
    </button>
  </svelte:fragment>
</Modal>
