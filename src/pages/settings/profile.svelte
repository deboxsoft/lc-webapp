<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";

  $: url = $params.backUrl || "./"

  async function saveHandler() {
    // await save(accountId);
    $goto(url, {}, true);
  }

  function closeHandler() {
    $goto(url, {}, true);
  }
</script>

<Modal class="modal-lg" open title="Pengaturan Profile">
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
