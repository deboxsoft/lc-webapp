<!--routify:options title="Posting Data"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "./_components/FormStock.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { create } = stores.getStockTransferContext();

  let stock = {};

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      $loading = false;
      notify(`Berhasil membuat data persediaan ${values.name}`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      console.error(e);
      $loading = false;
    }
  }
</script>

<Form {stock} title="Membuat Data Persediaan" {onSubmit} />
