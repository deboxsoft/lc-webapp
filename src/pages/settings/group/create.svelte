<script>
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import GroupForm from "./_form.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { createUserGranted } = getAclContext();
  if (!createUserGranted) {
    $goto("/access-denied");
  }
  const { createGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let fields;
  let schema;
  let submitHandler;
  $: url = "./";

  async function saveHandler() {
    try {
      $loading = true;
      const inputs = submitHandler();
      await createGroup(inputs);
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
  {#if $loading}
    <Loader />
  {:else}
    <GroupForm bind:fields bind:schema bind:submitHandler />
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
