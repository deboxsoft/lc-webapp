<!--routify:options title="membuat inventaris"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "../_components/FormInventory.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { create } = stores.getInventoryContext();

  let inventory = {};

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      $loading = false;
      notify(`Berhasil membuat data inventaris ${values.name}`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      console.error(e);
      $loading = false;
    }
  }
</script>

<Form {inventory} title="Membuat Data Inventaris" {onSubmit} />
