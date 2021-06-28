<script>
  import { stores } from "@deboxsoft/accounting-client";

  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboBox from "__@comps/forms/ComboxField.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  export let open = false;
  export let params = {};
  export let onFilter = () => {};

  const { accountStore } = stores.getAccountContext();

  let values = params;

  // filtering account type

  function submitHandler() {
    params = values || {};
    onFilter();
    open = false;
  }
</script>

<Modal title="filter" bind:open>
  <Form bind:values>
    <div class="form-group">
      <label for="date">Tanggal</label>
      <InputDate name="date" mode="menu" placeholder="Tanggal" />
    </div>
    <div class="form-group">
      <label for="accountId">Akun Debit</label>
      <AccountSelect id="accountId" placeholder="SEMUA" allowEmpty name="accountId" accountStore={accountStore} />
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <ComboBox id="status" name="status" items={["UNAPPROVED", "FIXED", "APPROVED"]} placeHolder="SEMUA" allowEmpty />
    </div>
  </Form>

  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-primary ml-1" on:click={submitHandler}>
      <i class="icon-filter4 mr-2" />
      Filter
    </button>
  </svelte:fragment>
</Modal>
