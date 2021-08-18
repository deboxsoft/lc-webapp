<!--routify:options title="program baru"-->
<script>
  import { goto } from "@roxi/routify";
  import ProgramForm from "./_components/ProgramForm.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { create } = getProgramContext();

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      notify(`data berhasil disimpan`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<ProgramForm account={{}} {onSubmit} title="Membuat Program baru" to="./" />
