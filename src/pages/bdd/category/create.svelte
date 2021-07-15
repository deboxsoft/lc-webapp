<!--routify:options title="Membuat kategori amortisasi"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "../_components/FormCategoryAmortization.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { createCategory } = stores.getBddContext();

  let categoryInventory = {};

  async function onSubmit(values) {
    try {
      $loading = true;
      await createCategory(values);
      $loading = false;
      notify(`Berhasil membuat kategori amortisasi ${values.name}`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<Form {categoryInventory} title="Membuat Data Kategori amortisasi" {onSubmit} />
