<script>
  import { goto, params } from "@roxi/routify";
  import { getUserContext } from "__@modules/users";
  import GroupForm from "../_form.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateUserGranted } = getAclContext();
  if (!updateUserGranted) {
    $goto("/access-denied");
  }
  let fields;
  let user;
  let schema;
  let submitHandler;
  const { updateGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  function closeHandler() {
    $goto("../");
  }

  async function saveHandler() {
    try {
      $loading = true;
      submitHandler();
      const { id = $params.id, ...input } = $fields;
      const result = await updateGroup($params.id, input);
      $goto("../");
      notify("Berhasil memperbarui user group", "success");
      $loading = false;
    } catch (e) {
      $loading = false;
    }
  }
</script>

<Modal class="modal-lg" open title="Ubah group user" onClose={closeHandler}>
  <GroupForm bind:fields bind:schema groupUser={$params} bind:submitHandler />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
