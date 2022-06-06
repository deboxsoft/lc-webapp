<!--routify:options title="Edit Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import { getUserContext } from "__@modules/users";
  import GroupForm from "../_form.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { updateGroup, groupStore } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let openDialog,
    schema,
    groupUser,
    ready = false,
    isValid,
    submitting = false,
    fields;

  $: {
    if (!ready && openDialog && $groupStore) {
      ready = true;
      const i = $groupStore.findIndex((_) => _.id === $params.id);
      groupUser = $groupStore[i];
      if (groupUser) {
        openDialog();
      }
    }
  }

  async function saveHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await updateGroup($params.id, input);
      closeHandler();
      notify(`Berhasil mengedit group user '${input.name}'.`, "success");
    } catch (error) {
      console.error(error);
      notify(`${error.errors[0].message}`, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Ubah group user" onClose={closeHandler} loading={!groupUser}>
  <GroupForm {groupUser} bind:fields bind:schema bind:isValid />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler} disabled={submitting || !$isValid}>Simpan</button>
  </svelte:fragment>
</Modal>
