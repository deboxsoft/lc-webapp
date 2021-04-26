<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import {getUserContext} from "__@modules/users"

  const {remove} = getUserContext();

  $: id = $params.id;

  async function removeHandler() {
    await remove(id);
    $goto("../");
  }

  function closeHandler() {
    $goto("../");
  }
  </script>

<Modal open title="Hapus User">
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus user id `{id}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
