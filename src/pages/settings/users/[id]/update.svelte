<script>
  import {goto} from "@roxi/routify"
  import { getUserContext } from "__@modules/users";
  import UserForm from "../_form.svelte";
  import Modal from "__@comps/Modal.svelte";

  let fields;
  let user;
  let schema
  const { getUser, update } = getUserContext();

  $: {
    if ($params.id) {
      user = getUser($params.id);
    }
  }

  async function saveHandler() {
    try {
      const inputs = schema.parse($fields)
      const result = await update($params.id, inputs);
      $goto("../")
    } catch (e) {

    }
  }
</script>

<Modal class="modal-lg" open title="Membuat User">
  <UserForm bind:fields bind:schema user={$user} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
