<!--routify:options title="Update Bank"-->
<script>
  import { params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  const { update, getBank } = stores.getBankContext();
  const { notify, loading } = getApplicationContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($params.id, values);
      notify("data berhasil diperbarui", "success");
      $loading = false;
    } catch (e) {
      $loading = false;
      notify(e.message, "error");
    }
  }
</script>
