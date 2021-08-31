<!--routify:options title="Posting Program"-->
<script>
  import { ProgramInputSchema } from "@deboxsoft/lc-cashier-api";
  import { goto } from "@roxi/routify";
  import ProgramForm from "./_components/ProgramForm.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify } = getApplicationContext();
  const { create } = getProgramContext();

  const program = {};
  async function onSubmit(values) {
    await create(values);
    notify(`data berhasil disimpan`, "success");
  }
</script>

<ProgramForm schema={ProgramInputSchema} {program} title="Membuat Program baru" {onSubmit} />
