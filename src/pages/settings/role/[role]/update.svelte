<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import RoleForm from "../_form.svelte";
  import { getAclContext } from "../../_acl-context";
  import { onMount } from "svelte";

  let openDialog;

  onMount(() => {
    openDialog()
  });
  const { updateUserGranted } = getAclContext();
  if (!updateUserGranted) {
    $goto("/access-denied");
  }
  let saveHandler;
  function closeHandler() {
    $goto("../");
  }

</script>

<Modal class="modal-full" bind:openDialog title="Ubah role" onClose={closeHandler}>
  <RoleForm bind:saveHandler role={$params.role} onSaved={() => $goto("../")} isUpdate />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
