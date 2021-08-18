<!--routify:options title="Edit Program"-->
<script>
  import { params, goto } from "@roxi/routify";
  import ProgramForm from "../_components/ProgramForm.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { notify, loading } = getApplicationContext();
  const { programStore, update, getProgram } = getProgramContext();
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }

  let program;
  $: {
    program = $programStore && getProgram($params.id);
  }

  async function onSubmit({ children, ...values }) {
    try {
      $loading = true;
      // remove not needed
      await update($params.id, values);
      $loading = false;
      notify(`Data berhasil diperbarui`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

{#if $program}
  <ProgramForm program={$program} {onSubmit} isUpdate title="Edit Akun" to={$params.to} />
{/if}