<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import UserForm from "./_form.svelte";
  import {getUserContext} from "__@modules/users"
  import {getApplicationContext} from "__@modules/app"

  const {create} = getUserContext()
  const {notify} = getApplicationContext()

  let fields;
  let schema;
  $: url = "./"

  async function saveHandler() {
    try {
      $fields.role = ["ADMIN"]
      const input = schema.parse($fields)
      await create(input);
      $goto(url);
    } catch (e) {
      console.error(e);
      notify(e, "error")
    }
  }

  function closeHandler() {
    $goto(url);
  }
</script>

<Modal class="modal-lg" open title="Membuat User">
  <UserForm bind:fields bind:schema />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
