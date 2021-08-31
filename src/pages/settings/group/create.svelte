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
  });
  const { createUserGranted } = getAclContext();
  if (!createUserGranted) {
    $goto("/access-denied");
  }
  const { createGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let isValid, submitting, to = "./";

  async function onSubmit(inputs) {
    await createGroup(inputs);
    notify("Berhasil membuat group user", "success");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Membuat Group User" onClose={closeHandler}>
  <GroupForm bind:submitting {to} {onSubmit} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler} disabled={!$isValid || submitting}>Simpan</button>
  </svelte:fragment>
</Modal>
