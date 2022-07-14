<!--routify:options title="Detail Pembelian"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import PurchaseView from "../_components/PurchaseView.svelte";
  import { getAclContext } from "__@root/utils";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";

  const { approveGranted } = getAclContext();
  const { loading, notify } = getApplicationContext();
  const { approve, reject, findById } = stores.getInventoryTransactionContext();
  const { getUser } = getAuthenticationContext();
  let closeUrl = $params.closeUrl || "../";
  let openDialog,
    inventoryTransaction,
    ready = false,
    approved,
    rejected,
    unapproved,
    createBy,
    approveBy,
    approveButtonEnable = false,
    rejectButtonEnable = false;

  findById($params.id).then((_) => {
    inventoryTransaction = _;
  });

  $: {
    if (!ready && inventoryTransaction && openDialog) {
      openDialog();
      ready = true;
      getUser(inventoryTransaction.userId).then((_) => {
        if (_) {
          createBy = _.name;
        }
      });
      if (inventoryTransaction.approveBy) {
        getUser(inventoryTransaction.approveBy).then((_) => {
          if (_) {
            approveBy = _.name;
          }
        });
      }
      unapproved = inventoryTransaction.status === "UNAPPROVED";
      if (approveGranted && unapproved) {
        approveButtonEnable = approveGranted && unapproved;
        rejectButtonEnable = approveGranted && unapproved;
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }

  async function approveHandler() {
    try {
      $loading = true;
      await approve(inventoryTransaction.id);
      notify(`data berhasil diApprove`, "success");
      closeHandler();
    } catch (e) {
      if (e?.code) {
        notify(e?.message || `data tidak berhasil diApprove`, "alert");
      } else {
        console.error(e);
      }
    } finally {
      $loading = false;
    }
  }

  async function rejectHandler() {
    try {
      $loading = true;
      await reject(inventoryTransaction.id);
      notify(`data berhasil berhasil direject`, "success");
      closeHandler();
    } catch (e) {
      notify(`data tidak berhasil direject`, "error");
    } finally {
      $loading = false;
    }
  }
</script>

<Modal class="modal-lg" title="Detail Data" bind:openDialog onClose={closeHandler} loading={!inventoryTransaction}>
  <PurchaseView {inventoryTransaction} {createBy} {approveBy} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}>Reject</button>
    {/if}
    {#if approveButtonEnable}
      <button type="button" class="btn btn-primary" on:click={approveHandler}>Approve</button>
    {/if}
  </svelte:fragment>
</Modal>
