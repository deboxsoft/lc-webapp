<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";
  import DetailRemoveBdd from "../../_components/DetailRemoveBdd.svelte"
  import { onMount } from "svelte";

  let openDialog;
  onMount(() => {
    openDialog();
  });

  const { removeGranted } = getAclContext();
  const { remove, getBdd } = stores.getBddContext();
  const { loading, notify } = getApplicationContext();

  if (!removeGranted) {
    $goto("/access-denied");
  }

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus barang '${$bdd.name}'`);
    } catch (e) {
      if (e.message) {
        notify(e.message, "error")
      }
      $loading = false;
    }
  }

  $: bdd = getBdd($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

{#if $bdd}
  <Modal bind:openDialog title="Hapus bdd" onClose={closeHandler}>
    <DetailRemoveBdd />
    <svelte:fragment slot="footer">
      <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
      <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
    </svelte:fragment>
  </Modal>
{/if}