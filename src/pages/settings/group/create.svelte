<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import GroupForm from "./_form.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { createGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let fields;
  let schema;
  let submitHandler;
  $: url = "./";

  async function saveHandler() {
    try {
      $loading = true;
      submitHandler();
      await createGroup($fields);
      $goto(url);
      notify("Berhasil membuat group user", "success");
      $loading = false;
    } catch (e) {
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(url);
  }
</script>

<Modal class="modal-lg" open title="Membuat Group User" onClose={closeHandler}>
  <GroupForm bind:fields bind:schema bind:submitHandler />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
