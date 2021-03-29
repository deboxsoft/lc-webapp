<!--routify:options title="update akun"-->
<script>
  import { params } from "@roxi/routify";
  import FormAccount from "../_forms/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { update, getAccount } = getAccountContext();
  let account
  $: {
    account = getAccount($params.id);
  }

  async function onSubmit(values) {
    await update($params.id, values);
  }
</script>

<FormAccount account={$account} {onSubmit} isUpdate title="Update Akun" to="../" />