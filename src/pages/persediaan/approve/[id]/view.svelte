<!--routify:options title="Detail Pembelian"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import ApproveView from "../_components/ApproveView.svelte";
  import { getAclContext } from "__@root/utils";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";

  const { approveGranted } = getAclContext();
  const { loading, notify } = getApplicationContext();
  const { approve, reject, findById } = stores.getStockTransactionContext();
  const { getUser } = getAuthenticationContext();

  let openDialog,
    stockTransaction,
    ready = false,
    approved,
    rejected,
    unapproved,
    userPromise,
    approveButtonEnable = false,
    rejectButtonEnable = false;

  findById($params.id).then((_) => {
    stockTransaction = _;
  });

  $: {
    if (!ready && stockTransaction && openDialog) {
      openDialog();
      ready = true;
      userPromise = getUser(stockTransaction.userId);
      approved = stockTransaction.status === "APPROVED";
      rejected = stockTransaction.status === "REJECTED";
      unapproved = stockTransaction.status === "UNAPPROVED";
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
      await approve(stockTransaction.id);
      notify(`data berhasil berhasil diApprove`, "success");
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
      await reject(stockTransaction.id);
      notify(`data berhasil direject`, "success");
      closeHandler();
    } catch (e) {
      notify(`data tidak berhasil direject`, "error");
    } finally {
      $loading = false;
    }
  }
</script>

<Modal class="modal-lg" title="Detail Data" bind:openDialog onClose={closeHandler} loading={!stockTransaction}>
  <ApproveView {stockTransaction} {userPromise} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}> Reject </button>
    {/if}
    {#if approveButtonEnable}
      <button type="button" class="btn btn-primary" on:click={approveHandler}> Approve </button>
    {/if}
  </svelte:fragment>
</Modal>
