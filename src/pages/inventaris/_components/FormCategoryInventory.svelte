<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { InventoryInputSchema } from "@deboxsoft/accounting-api";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  const { notify, loading } = getApplicationContext();
  const { currentDateStore } = stores.getPreferenceContext();
  const { categoryInventoryStore } = stores.getInventoryContext();
  const dispatch = createEventDispatcher();

  const depreciationMethods = [{ id: "STRAIGHT_LINE", label: "Garis Lurus" }];

  // props
  export let inventory;
  export const isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";

  // state
  let fields;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);

  async function submitHandler() {
    try {
      $loading = true;
      await onSubmit($fields);
      $loading = false;
      $goto(to);
    } catch (error) {
      notify(`${error.errors[0].message}`, "error");
      $loading = false;
    }
  }

  function cancelHandler() {
    $goto(to);
  }
</script>

<Modal {title} onClose={cancelHandler}>
  <Form schema={InventoryInputSchema} values={inventory} bind:fields bind:submitted>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="purchaseDate">Umur Aset</label>
        <InputField id="estimatedLife" name="estimatedLife" class="form-control" placeholder="Umur Aset" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="depreciationMethod">Metode Depresiasi</label>
        <ComboxField
          id="depreciationMethod"
          name="depreciationMethod"
          class="form-control"
          items={depreciationMethods}
          placeholder="Metode Depresiasi"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="assetAccount">Akun Aset</label>
        <AccountSelect id="assetAccount" name="assetAccount" class="form-control" placeholder="Akun Aset" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="accumulatedDepreciationAccount">Akun Akumulasi Depresiasi</label>
        <AccountSelect
          id="accumulatedDepreciationAccount"
          name="accumulatedDepreciationAccount"
          class="form-control"
          placeholder="Akun Aset"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="depreciationAccount">Akun Beban Depresiasi</label>
        <AccountSelect
          id="depreciationAccount"
          name="depreciationAccount"
          class="form-control"
          placeholder="Akun Aset"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="quantity">Rasio Depresiasi</label>
        <InputField id="quantity" name="quantity" class="form-control" type="number" placeholder="Rasio Depresiasi" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="priceItem">Nilai Residu</label>
        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Nilai Residu" />
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={$loading} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
