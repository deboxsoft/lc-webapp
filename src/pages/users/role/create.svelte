<!--routify:options title="Data Baru"-->
<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import RoleForm from "./_form.svelte";
  import { getAclContext } from "__@root/utils";
  import { onMount } from "svelte";

  const { createGranted } = getAclContext();
  let openDialog;

  onMount(() => {
    openDialog();
  });
  if (!createGranted) {
    $goto("/access-denied");
  }
  let saveHandler;

  function closeHandler() {
    $goto("./");
  }
</script>

<Modal class="modal-full" bind:openDialog title="Membuat role" onClose={closeHandler}>
  <RoleForm bind:saveHandler onSaved={() => $goto("./")} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
