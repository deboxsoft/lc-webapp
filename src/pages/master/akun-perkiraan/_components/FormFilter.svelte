<script>
  import { stores } from "@deboxsoft/accounting-client";

  import Modal from "../../../../components/Modal.svelte";
  import Form from "../../../../components/forms/Form.svelte";
  import ComboBox from "../../../../components/forms/ComboxField.svelte";

  export let openDialog;
  export let closeDialog;
  export let onClose;
  export let params = {};
  export let onFilter = () => {};

  let values = params;
  const { accountsType } = stores.getAccountContext();

  // filtering account type
  $: accountTypeItems = $accountsType.filter((_) => {
    return !_.disable;
  });

  function submitHandler() {
    params = values || {};
    onFilter();
    closeDialog()
  }

</script>

<Modal title="filter" bind:openDialog bind:onClose bind:closeDialog>
  <Form bind:values>
    <label for="type">Klasifikasi Akun</label>
    <ComboBox
      id="type"
      name="type"
      items={accountTypeItems}
      labelId="label"
      valueId="code"
      placeHolder="SEMUA"
      allowEmpty
    />
  </Form>

  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-primary ml-1" on:click={submitHandler}>
      <i class="icon-filter4 mr-2" />
      Filter
    </button>
  </svelte:fragment>
</Modal>
