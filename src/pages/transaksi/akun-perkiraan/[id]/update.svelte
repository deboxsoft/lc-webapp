<!--routify:options title="update akun"-->
<script>
  import { params } from "@roxi/routify";
  import FormAccount from "../_components/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";

  export let to = "../";

  const { accountStore, update, getAccount } = getAccountContext();
  let account;
  $: {
    account = getAccount($params.id);
    // console.log($params.id);
  }

  async function onSubmit({ children, ...values }) {
    await update($params.id, values);
  }
</script>

<FormAccount account={$account} {onSubmit} isUpdate title="Update Akun" {to} />
