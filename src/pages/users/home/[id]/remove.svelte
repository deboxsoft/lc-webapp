<!--routify:options title="Hapus User"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog()
  });
  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }
  const { remove, getUser } = getUserContext();
  const { notify, loading } = getApplicationContext();

  $: user = getUser($params.id);

  async function removeHandler() {
    try {
      $loading = true;
      const username = $user.username;
      await remove($user.id);
      $goto("../");
      $loading = false;
      notify(`Berhasil menghapus user ${username}`, "success");
    } catch (e) {
      $loading = false
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog title="Hapus User">
  {#if $user}
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus user `{$user.username}`?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
