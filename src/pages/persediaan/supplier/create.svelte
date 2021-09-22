<!--routify:options title="Buat Data Supplier"-->
<script>
  import { SupplierCreateSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "./_components/SupplierForm.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify } = getApplicationContext();
  const { create } = stores.getSupplierContext();



  let supplier = {};

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data supplier ${values.name}`, "success");
  }
</script>

<CategoryInventoryForm {supplier} schema={SupplierCreateSchema} title="Membuat Data Supplier" {onSubmit} />
