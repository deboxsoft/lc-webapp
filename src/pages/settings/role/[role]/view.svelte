<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import RoleForm from "../_form.svelte";
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog();
  });
  function closeHandler() {
    $goto("../");
  }
</script>

<Modal class="modal-full" bind:openDialog title="Ubah role" onClose={closeHandler}>
  <RoleForm readOnly role={$params.role} onSaved={() => $goto("../")} isUpdate />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
  </svelte:fragment>
</Modal>
