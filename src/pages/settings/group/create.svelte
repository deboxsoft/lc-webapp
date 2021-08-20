<script>
  import { goto } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import Loader from "../../../components/loader/Loader.svelte";
  import GroupForm from "./_form.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog();
    state = "mounted";
  });
  const { createUserGranted } = getAclContext();
  if (!createUserGranted) {
    $goto("/access-denied");
  }
  const { createGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let fields;
  let schema;
  let state = "load";
  let submitHandler;
  $: url = "./";

  async function saveHandler() {
    try {
      $loading = true;
      state = "save-proses";
      const inputs = submitHandler();
      await createGroup(inputs);
      notify("Berhasil membuat group user", "success");
      $loading = false;
      state = "save-complete";
      $goto(url);
    } catch (e) {
      state = "save-failed";
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(url);
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Membuat Group User" onClose={closeHandler}>
  <GroupForm bind:fields bind:schema bind:submitHandler />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler} disabled={state === "save-proses"}>Simpan</button>
  </svelte:fragment>
</Modal>
