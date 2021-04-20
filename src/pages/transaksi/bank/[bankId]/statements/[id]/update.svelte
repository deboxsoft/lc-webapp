<!--routify:options title="Update Bank"-->
<script>
  import { params } from "@roxi/routify";
  import { getBankContext } from "__@modules/accounting";

  const { update, getBank } = getBankContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    await update($params.id, values);
  }
</script>

