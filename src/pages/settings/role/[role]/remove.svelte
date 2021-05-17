<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { get } from "svelte/store";
  import { getAclContext } from "../../_acl-context";

  const { removeUserGranted } = getAclContext();
  if (!removeUserGranted) {
    $goto("/access-denied");
  }
  const { save, grants } = getAccessControlContext();
  const { notify } = getApplicationContext();

  async function removeHandler() {
    try {
      const _grants = get(grants);
      delete _grants[$params.role]
      await save(_grants);
      notify(`Berhasil menghapus role ${$params.role}`, "success");
      $goto("../");
    } catch (e) {
      notify(e.message, "error");
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal open title="Hapus Role">
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus role `{$params.role}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
