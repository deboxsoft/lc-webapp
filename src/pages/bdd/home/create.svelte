<!--routify:options title="membuat bdd"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Form from "../_components/FormBdd.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { create } = stores.getBddContext();

  let bdd = {};

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      $loading = false;
      notify(`Berhasil membuat data bdd ${values.name}`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      console.error(e);
      $loading = false;
    }
  }
</script>

<Form {bdd} title="Membuat Data Bdd" {onSubmit} />
