<script>
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { getAccountContext } from "__@modules/accounting";
  import { createEventDispatcher } from "svelte";
  import { AccountSchema } from "@deboxsoft/accounting-api";

  // components
  import Modal from "__@comps/Modal.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import InputCheck from "__@comps/forms/InputCheckSwitchery.svelte";
  import AccountCombox from "__@comps/account/AccountComboxField.svelte";

  // context
  const { notify } = getApplicationContext();
  const { accountStore, getAccount, getAccountParentList } = getAccountContext();
  const dispatch = createEventDispatcher();
  const parentAccountStore = getAccountParentList();

  export let isUpdate;
  export let account = {};
  export let onSubmit;
  export let title;
  export let to;
  let loading = false;
  let isParent;

  async function submitHandler(e) {
    loading = true;
    try {
      await onSubmit(account);
      loading = false;
      $goto(to);
    } catch (e) {
      loading = false;
    }
  }

  function cancelHandler() {
    $goto(to);
  }

  function isParentChangeHandler(e) {
    isParent = e.detail;
  }
</script>
<Modal {title}>
  <Form ignoreAttribs={[]} schema={AccountSchema} values={account} on:submit={submitHandler} on:cancel={cancelHandler}>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-12">
            <label for="id">Kode</label>
            <InputNumberField
              id="id"
              name="id"
              options={{ decimalPlaces: 0, digitGroupSeparator: '', maximumValue: '99999999' }}
              prependDisable={true}
              textPosition="left"
              resultType="string"
              format="number"
              class="form-control"
              placeholder="Kode"
              disabled={isUpdate}
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="name">Nama</label>
            <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
          </div>
        </div>
        {#if !isParent}
          <div class="row">
            <div class="form-group col-12">
              <label for="accountType">Klasifikasi Akun</label>
                <AccountCombox id="parentId" name="parentId" accountStore={parentAccountStore} allowEmpty />
<!--              <AccountSelect id="parentId" name="parentId" accountStore={parentAccountStore} allowEmpty />-->
            </div>
          </div>
        {/if}
        <div class="row">
          <div class="col-12">
            <InputCheck id="isParent" name="isParent" on:change={isParentChangeHandler} disabled={isUpdate}>
              Akun sebagai induk
            </InputCheck>
          </div>
        </div>
      </div>
    </div>
  </Form>
    <svelte:fragment slot="footer">
      <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
        Cancel
      </button>
      <button type="submit" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
        <SaveIcon class="mr-2" />
        Save
      </button>
    </svelte:fragment>
</Modal>