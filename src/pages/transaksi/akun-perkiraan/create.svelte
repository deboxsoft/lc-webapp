<!--routify:options title="create akun"-->
<script>
  import FormAccount from "./_forms/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { create } = getAccountContext();

  async function onSubmit(values) {
    await create(values);
  }
</script>

<FormAccount account={{}} {onSubmit} title="Membuat Akun" to="./" />
