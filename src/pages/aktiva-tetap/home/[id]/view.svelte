<!--routify:options title="Detail Aktiva Tetap"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import InventoryView from "../../_components/InventoryView.svelte";
  import { getAclContext } from "__@root/pages/bdd/_acl-context";
  import { getApplicationContext } from "__@modules/app";

  const { loading, notify } = getApplicationContext();
  const { inventoryDetail, approve, reject } = stores.getInventoryContext();
  const { createGranted } = getAclContext()

  const rejectButtonEnable = createGranted;
  const approveButtonEnable = createGranted;

  export let to = "../";
  let openDialog, inventory;

  inventoryDetail($params.id).then((_) => {
    inventory = _;
    openDialog();
  });

  async function approveHandler() {
    $loading = true;
    if (await approve(inventory.id)) {
      notify(`approve aktiva tetap id '${inventory.id}' berhasil diapprove`, "success");
    } else {
      notify(`approve aktiva tetap id '${inventory.id}' tidak berhasil diapprove`, "error");
    }
    $loading = false;
    closeHandler();
  }

  async function rejectHandler() {
    $loading = true;
    const result = await reject(inventory.id);
    if (await reject(inventory.id)) {
      notify(`reject aktiva tetap id '${inventory.id}' berhasil direject`, "success");
    } else {
      notify(`reject aktiva tetap id '${inventory.id}' tidak berhasil`, "error");
    }
    $loading = false;
    closeHandler();
  }

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Aktiva Tetap" bind:openDialog onClose={closeHandler}>
  <InventoryView {inventory} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable &&  inventory?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}> Reject </button>
    {/if}
    {#if approveButtonEnable &&  inventory?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-primary" on:click={approveHandler}> Approve </button>
    {/if}
  </svelte:fragment>
</Modal>
