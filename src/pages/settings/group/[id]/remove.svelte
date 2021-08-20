<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog();
  });
  const { removeUserGranted } = getAclContext();
  if (!removeUserGranted) {
    $goto("/access-denied");
  }
  const { removeGroup } = getUserContext();
  const { notify, loading } = getApplicationContext();

  async function removeHandler() {
    try {
      $loading = true;
      await removeGroup($params.id);
      $goto("../");
      notify(`Berhasil menghapus group ${$params.name}`, "success");
      $loading = false;
    } catch (e) {
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog title="Hapus group user">
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus group `{$params.name}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
