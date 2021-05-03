<!--routify:options title="Update Bank"-->
<script>
  import { params } from "@roxi/routify";
  import { getBankContext } from "__@modules/accounting";
  import FormBank from "../_components/FormBank.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { update, getBank } = getBankContext();
  const { loading, notify } = getApplicationContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($params.id, values);
      notify(`Berhasil mengupdate data bank id '${$params.id}'`);
      $loading = false;
    } catch (e) {
      $loading = false;
    }
  }
</script>

<FormBank bank={$bank} isUpdate {onSubmit} title="Update Bank" to={$params.to} />
