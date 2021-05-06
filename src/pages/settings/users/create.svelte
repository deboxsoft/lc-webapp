<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import UserForm from "./_form.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { create } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let fields;
  let schema;
  let submitHandler;
  $: url = "./";

  async function saveHandler() {
    try {
      $loading = true;
      submitHandler();
      await create($fields);
      notify(`berhasil membuat user '${$fields.username}'`, "success");
      $loading = false;
      $goto(url);
    } catch (e) {
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(url);
  }
</script>

<Modal class="modal-lg" open title="Membuat User" onClose={closeHandler}>
  <UserForm bind:fields bind:schema bind:submitHandler />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
