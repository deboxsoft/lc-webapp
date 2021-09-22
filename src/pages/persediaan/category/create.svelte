<!--routify:options title="Buat Kategori Barang"-->
<script>
  import { CategoryProductCreateSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "./_components/CategoryProductForm.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify } = getApplicationContext();
  const { create } = stores.getCategoryProductContext();



  let categoryProduct = {};

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat kategori Barang ${values.name}`, "success");
  }
</script>

<CategoryInventoryForm {categoryProduct} schema={CategoryProductCreateSchema} title="Membuat Data Barang" {onSubmit} />
