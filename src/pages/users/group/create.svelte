<!--routify:options title="Data Baru"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import GroupForm from "./_form.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { createGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let openDialog,
    isValid,
    submitting = false,
    fields,
    groupUser = {},
    schema,
    ready = false;

  $: {
    if (!ready && openDialog) {
      ready = true;
      openDialog();
    }
  }

  async function saveHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await createGroup(input);
      closeHandler();
      notify(`Berhasil membuat group user '${input.name}'.`, "success");
    } catch (e) {
      console.error(e);
      notify(e.message, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("./");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Membuat Group User" onClose={closeHandler} loading={!groupUser}>
  <GroupForm {groupUser} bind:schema bind:fields bind:isValid />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler} disabled={!$isValid || submitting}>Simpan</button>
  </svelte:fragment>
</Modal>
