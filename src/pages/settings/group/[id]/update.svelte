<script>
  import { goto, params } from "@roxi/routify";
  import { getUserContext } from "__@modules/users";
  import GroupForm from "../_form.svelte";
  import Modal from "../../../../components/Modal.svelte";
  import Loader from "../../../../components/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog();
    state = "mounted";
  });
  const { updateUserGranted } = getAclContext();
  if (!updateUserGranted) {
    $goto("/access-denied");
  }
  let fields;
  let user;
  let schema;
  let submitHandler;
  let state = "load";
  const { updateGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  function closeHandler() {
    state = "close"
    $goto("../");
  }

  async function saveHandler() {
    try {
      state = "save-proses"
      $loading = true;
      const inputs = submitHandler();
      const { id = $params.id, ...input } = inputs;
      const result = await updateGroup($params.id, input);
      notify("Berhasil memperbarui user group", "success");
      state = "save-complete";
      $loading = false;
      $goto("../");
    } catch (e) {
      console.error(e);
      state = "save-failed";
      $loading = false;
    }
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Ubah group user" onClose={closeHandler}>
  <GroupForm bind:fields bind:schema groupUser={$params} bind:submitHandler />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler} disabled={state === "save-proses"}>Simpan</button>
  </svelte:fragment>
</Modal>
