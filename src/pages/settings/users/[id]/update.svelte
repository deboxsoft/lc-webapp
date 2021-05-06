<script>
  import { goto, params } from "@roxi/routify";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import UserForm from "../_form.svelte";
  import Modal from "__@comps/Modal.svelte";

  let fields;
  let user;
  let schema;
  let submitHandler;
  const { getUser, update, userStore } = getUserContext();
  const { notify, loading } = getApplicationContext();

  $: {
    user = getUser($params.id);
  }

  async function saveHandler() {
    try {
      $loading = true;
      submitHandler();
      const { id, ...input } = $fields;
      const result = await update($params.id, input);
      notify(`User ${$user.username} berhasil diperbarui`, "success");
      $loading = false;
      $goto("../");
    } catch (e) {
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal class="modal-lg" open title="Mengedit user" onClose={closeHandler}>
  {#if !$user}
    <Loader />
  {:else}
    <UserForm bind:fields bind:schema user={$user} isUpdate bind:submitHandler />
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
