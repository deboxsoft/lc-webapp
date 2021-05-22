<!--routify:options title="membuat inventaris"-->
<script>
  import { getInventoryContext, getPreferenceContext } from "__@modules/accounting";
  import Form from "./_components/FormInventory.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { currentDateStore } = getPreferenceContext();
  const { create } = getInventoryContext();

  let inventory = {
    date: $currentDateStore
  };

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
