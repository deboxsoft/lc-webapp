<!--routify:options title="Hapus Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  let openDialog, bdd, desc;

  const { removeGranted } = getAclContext();
  const { remove, getBdd, bddStore } = stores.getBddContext();
  const { loading, notify } = getApplicationContext();

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if ($bddStore && openDialog) {
      bdd = getBdd($params.id);
      if (bdd) {
        desc = bdd.description;
        openDialog();
      }
    }
  }

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus data bdd ${desc ? `'${desc}'` : ``}.`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog title="Hapus bdd" onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus data bdd {desc ? `'${desc}'` : ""}?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
