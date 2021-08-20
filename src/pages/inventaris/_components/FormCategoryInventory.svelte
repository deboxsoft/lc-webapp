<script>
  import { groupDepreciation } from "@deboxsoft/accounting-api";
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { InventoryInputSchema } from "@deboxsoft/accounting-api";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "../../../components/forms/Form.svelte";
  import InputField from "../../../components/forms/InputField.svelte";
  import ComboxField from "../../../components/forms/ComboxField.svelte";
  import AccountSelect from "../../../components/account/AccountSelect.svelte";

  const { notify, loading } = getApplicationContext();
  const { categoryInventoryStore } = stores.getInventoryContext();
  const dispatch = createEventDispatcher();

  const depreciationMethods = [{ id: "STRAIGHT_LINE", label: "Garis Lurus" }];

  // props
  export let categoryInventory;
  export const isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";

  // state
  let state = "prepare";
  let openDialog;
  let fields;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);

  onMount(() => {
    openDialog();
  });

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

<Modal bind:openDialog {title} onClose={cancelHandler}>
  <Form schema={InventoryInputSchema} values={categoryInventory} bind:fields bind:submitted>
    <div class="row">
      <div class="form-group col-12">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="depreciationMethod">Kelompok Depresiasi</label>
        <ComboxField
          id="depreciationGroup"
          name="groupDepreciationId"
          class="form-control"
          items={groupDepreciation}
          placeholder="Kelompok Depresiasi"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="assetAccount">Akun Aset Inventaris</label>
        <AccountSelect id="assetAccount" name="assetAccount" placeholder="Akun Aset" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="accumulatedDepreciationAccount">Akun Akumulasi Depresiasi</label>
        <AccountSelect
          id="accumulatedDepreciationAccount"
          name="accumulatedDepreciationAccount"
          placeholder="Akun Aset"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="expenseDepreciationAccount">Akun Biaya Depresiasi</label>
        <AccountSelect id="expenseDepreciationAccount" name="expenseDepreciationAccount" placeholder="Akun Aset" />
      </div>
    </div>
    <!--    <div class="row">-->
    <!--      <div class="form-group col-12 col-md-6">-->
    <!--        <label for="quantity">Rasio Depresiasi</label>-->
    <!--        <InputField id="quantity" name="quantity" class="form-control" type="number" placeholder="Rasio Depresiasi" />-->
    <!--      </div>-->
    <!--      <div class="form-group col-12 col-md-6">-->
    <!--        <label for="priceItem">Nilai Residu</label>-->
    <!--        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Nilai Residu" />-->
    <!--      </div>-->
    <!--    </div>-->
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
