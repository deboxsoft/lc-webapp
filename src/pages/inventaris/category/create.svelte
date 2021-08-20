<!--routify:options title="Buat Kategori Inventaris"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "../_components/FormCategoryInventory.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { createCategory } = stores.getInventoryContext();

  let categoryInventory = {};

  async function onSubmit(values) {
    try {
      $loading = true;
      await createCategory(values);
      $loading = false;
      notify(`Berhasil membuat kategori inventaris ${values.name}`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<Form {categoryInventory} title="Membuat Data Kategori Inventaris" {onSubmit} />
