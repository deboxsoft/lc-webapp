<!--routify:options title="Update Bank"-->
<script>
  import { params } from "@roxi/routify";
  import { getBankContext } from "__@modules/accounting";
  import FormBank from "../_components/FormBank.svelte";

  const { update, getBank } = getBankContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    await update($params.id, values);
  }
</script>

<FormBank bank={$bank} isUpdate {onSubmit} title="Update Bank" to={$params.to} />
