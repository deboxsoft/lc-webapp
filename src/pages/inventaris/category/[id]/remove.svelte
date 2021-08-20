<!--routify:options title="Hapus Kategori Inventaris"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  const { removeCategory, getCategoryInventory } = stores.getInventoryContext();
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
      notify(`berhasil menghapus data katagori '${$categoryInventory.name}'`);
    } catch (e) {
      if (e.message) {
        notify(e.message, "error")
      }
      $loading = false;
    }
  }

  $: categoryAmortization = getBank($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

{#if $categoryInventory}
  <Modal open title="Hapus Kategori Inventaris" onClose={closeHandler}>
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus bank "{$categoryInventory.name}"?
    </div>
    <svelte:fragment slot="footer">
      <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
      <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
    </svelte:fragment>
  </Modal>
{/if}