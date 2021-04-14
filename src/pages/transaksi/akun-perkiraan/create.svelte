<!--routify:options title="create akun"-->
<script>
  import FormAccount from "./_components/FormAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import { get } from "svelte/store";

  const { create } = getAccountContext();

  async function onSubmit(values) {
    if (values.isParent) {
      // remove variable if parent
      delete values.startDateBalance;
      delete values.startBalance;
      delete values.parentId;
    }
    await create(values);
  }
</script>

<FormAccount account={{}} {onSubmit} title="Membuat Akun" to="./" />
