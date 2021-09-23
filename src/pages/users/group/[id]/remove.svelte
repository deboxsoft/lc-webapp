<!--routify:options title="Hapus Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getUserContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }
  const { removeGroup, groupStore } = getUserContext();
  const { notify, loading } = getApplicationContext();

  let openDialog,
    groupUser,
    name,
    ready = false;

  $: {
    if (!ready && openDialog && $groupStore) {
      ready = true;
      const i = $groupStore.findIndex((_) => _.id === $params.id);
      groupUser = $groupStore[i];
      if (groupUser) {
        name = groupUser.name;
        openDialog();
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      await removeGroup($params.id);
      $goto("../");
      notify(`Berhasil menghapus group ${name}`, "success");
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
    Apa anda yakin akan menghapus group `{name}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
