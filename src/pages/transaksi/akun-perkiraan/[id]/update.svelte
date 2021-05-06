<!--routify:options title="update akun"-->
<script>
  import { params } from "@roxi/routify";
  import FormAccount from "../_components/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { accountStore, update, getAccount } = getAccountContext();
  let account;
  $: {
    account = getAccount($params.id);
  }

  async function onSubmit({ children, ...values }) {
    try {
      $loading = true;
      await update($params.id, values);
      $loading = false;
      notify(`kode akun '${$params.id}' berhasil diperbarui`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<FormAccount account={$account} {onSubmit} isUpdate title="Update Akun" to={$params.to} />
