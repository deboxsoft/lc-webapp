<!--routify:options title="create akun"-->
<script>
  import FormAccount from "./_components/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { create } = getAccountContext();

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
