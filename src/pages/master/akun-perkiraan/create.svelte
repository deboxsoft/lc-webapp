<!--routify:options title="Buat Akun"-->
<script>
  import { goto } from "@roxi/routify";
  import FormAccount from "./_components/FormAccount.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { create } = stores.getAccountContext();

  async function onSubmit(values) {
    if (values.isParent) {
      // remove variable if parent
      delete values.startDateBalance;
      delete values.startBalance;
      delete values.parentId;
    }
    try {
      $loading = true;
      await create(values);
      notify(`kode akun '${values.id}' berhasil disimpan`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<FormAccount account={{}} {onSubmit} title="Membuat Akun" to="./" />
