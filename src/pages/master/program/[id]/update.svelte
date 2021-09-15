<!--routify:options title="Edit Program"-->
<script>
  import { ProgramUpdateSchema } from "@deboxsoft/lc-cashier-api";
  import { params, goto } from "@roxi/routify";
  import ProgramForm from "../_components/ProgramForm.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { notify } = getApplicationContext();
  const { programStore, update, getProgram } = getProgramContext();
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }

  $: to = $params.to || "../";
  $: program = $programStore && getProgram($params.id);

  async function onSubmit({ children, ...values }) {
    await update($params.id, values);
    notify(`Data berhasil diperbarui`, "success");
  }
</script>

{#if program}
  <ProgramForm {program} schema={ProgramUpdateSchema} {onSubmit} isUpdate title="Edit Program" {to} />
{/if}
