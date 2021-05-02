<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import RoleForm from "./_form.svelte";

  let saveHandler;

  function closeHandler() {
    $goto("./");
  }
</script>

<Modal class="modal-full" open title="Membuat role" onClose={closeHandler}>
  <RoleForm  bind:saveHandler onSaved={() => $goto("./")} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
