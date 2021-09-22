<script>
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { notify, loading } = getApplicationContext();
  const { stockStore, categoryStore, supplierStore } = stores.getStockContext();
  const { getAccountLeaf } = stores.getAccountContext();

  // props
  export let product;
  export let schema;
  export let isUpdate = false;
  export let isValid;
  export let fields;
  export let fieldsErrors;
</script>

<Form checkValidateFirst {schema} values={product} bind:fields bind:fieldsErrors bind:isValid>
  <div class="row">
    <div class="form-group col-12">
      <label for="name">Nama</label>
      <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
    </div>
  </div>
  <div class="row">
    <div class="form-group col-12 col-md-6">
      <label for="categoryId">Kategori Barang</label>
      <ComboxField
        id="categoryId"
        name="categoryId"
        items={$categoryStore}
        labelId="name"
        placeHolder="Kategori Barang"
      />
    </div>
    <div class="form-group col-12 col-md-6">
      <label for="supplierId">Supplier</label>
      <ComboxField
        allowEmpty
        id="supplierId"
        name="supplierId"
        items={$supplierStore}
        labelId="name"
        placeHolder="Supplier"
      />
    </div>
  </div>
  <div class="row">
    <div class="form-group col-12">
      <label for="unit">Satuan</label>
      <InputField id="unit" name="unit" type="text" class="form-control" placeholder="Satuan" />
    </div>
  </div>
</Form>
