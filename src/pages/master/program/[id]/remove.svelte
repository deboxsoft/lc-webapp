<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { remove, programStore, getProgram } = getProgramContext();
  const { notify, loading } = getApplicationContext();
  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }

  let openDialog,
    name,
    program,
    booting = true;

  $: {
    if (booting && $programStore && openDialog) {
      booting = false;
      program = $programStore && getProgram($params.id);
      if (program) {
        name = program.name;
        openDialog();
      }
    }
  }


  async function removeHandler() {
    try {
      $loading = true;
      name = program.name;
      await remove(program.id);
      $goto("../");
      notify(`Program '${name}' berhasil dihapus`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Hapus Data Program" onClose={closeHandler} bind:openDialog>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus program `{program.name}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
