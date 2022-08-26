<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboBox from "__@comps/forms/ComboxField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { writable } from "svelte/store";

  export let filter = writable({});
  export let title = "Filter";
  export let isReport = false;
  export let openDialog;
  export let closeDialog;
  let fields;

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;

  const { accountStore } = stores.getAccountContext();
  const { categoryProductStore } = stores.getCategoryProductContext();
  const { supplierStore } = stores.getSupplierContext();
  export function clearFilter() {
    $filter = $fields = {};
  }
  export function submitFilter() {
    const { name, ...inputs } = $fields || {};
    $filter = {
      name: name === "" ?? name,
      ...inputs
    };
  }
</script>

<Modal {title} bind:onClose bind:openDialog bind:closeDialog>
  <Form values={$filter} bind:fields feedbackValidateDisable>
    <div class="form-group">
      <label for="accountId">Nama</label>
      <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
    </div>
    <div class="form-group">
      <label for="categoryId">Kategori Produk</label>
      <ComboBox
        id="categoryId"
        name="categoryId"
        items={$categoryProductStore}
        labelId="name"
        placeHolder="SEMUA"
        allowEmpty
      />
    </div>
    <div class="form-group">
      <label for="supplierId">Supplier</label>
      <ComboBox
        allowEmpty
        id="supplierId"
        name="supplierId"
        items={$supplierStore}
        labelId="name"
        placeHolder="Supplier"
      />
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
