<!--routify:options title="Buat Kategori Aktiva Tetap"-->
<script>
  import { CategoryInventoryInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "../_components/CategoryInventoryForm.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify } = getApplicationContext();
  const { createCategory } = stores.getInventoryContext();

  let categoryInventory = {
    groupDepreciationId: "1"
  };

  async function onSubmit(values) {
    await createCategory(values);
    notify(`Berhasil membuat kategori aktiva tetap ${values.name}`, "success");
  }
</script>

<CategoryInventoryForm {categoryInventory} schema={CategoryInventoryInputSchema} title="Membuat Data Kategori Aktiva Tetap" {onSubmit} />
