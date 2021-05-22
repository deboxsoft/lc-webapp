<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getInventoryContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import DetailRemoveInventory from "../_components/DetailRemoveInventory.svelte"

  const { removeGranted } = getAclContext();
  const { removeCategory, getCategoryInventory } = getInventoryContext();
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
      notify(`berhasil menghapus barang '${$inventory.name}'`);
    } catch (e) {
      if (e.message) {
        notify(e.message, "error")
      }
      $loading = false;
    }
  }

  $: inventory = getBank($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

{#if $inventory}
  <Modal open title="Hapus Inventaris" onClose={closeHandler}>
    <DetailRemoveInventory />
    <svelte:fragment slot="footer">
      <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
      <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
    </svelte:fragment>
  </Modal>
{/if}