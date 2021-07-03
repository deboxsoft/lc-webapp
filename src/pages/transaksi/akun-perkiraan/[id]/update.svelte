<!--routify:options title="update akun"-->
<script>
  import { params, goto } from "@roxi/routify";
  import FormAccount from "../_components/FormAccount.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { notify, loading } = getApplicationContext();
  const { accountStore, update, getAccount } = stores.getAccountContext();
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }

  let account;
  $: {
    account = getAccount($params.id);
  }

  async function onSubmit({ children, ...values }) {
    try {
      $loading = true;
      // remove not needed
      delete values.balance;
      delete values.balanceFixed;
      await update($params.id, values);
      $loading = false;
      notify(`kode akun '${$params.id}' berhasil diperbarui`, "success");
    } catch (e) {
      console.log(e);
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<FormAccount account={$account} {onSubmit} isUpdate title="Update Akun" to={$params.to} />
