<!--routify:options title="Membuat kategori inventaris"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "./_components/FormInventory.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { currentDateStore } = stores.getPreferenceContext();
  const { createCategory } = stores.getInventoryContext();

  let inventory = {
    date: $currentDateStore
  };

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

<Form {inventory} title="Membuat Data Kategori Inventaris" {onSubmit} />
