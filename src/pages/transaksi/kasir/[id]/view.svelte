<!--routify:options title="Detail Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import CashierView from "../_components/CashierView.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { getAclContext } from "__@root/utils/acl-utils";
  import { getApplicationContext } from "__@modules/app";

  const { approveGranted } = getAclContext();
  const { loading, notify } = getApplicationContext();

  const { getCashier, cashierStore, approve, reject } = getCashierContext();
  let closeUrl = $params.closeUrl || "../",
    openDialog,
    ready = false,
    cashier,
    approved,
    rejected,
    unapproved,
    approveButtonEnable = false,
    rejectButtonEnable = false;
  $: {
    if (!ready && $cashierStore && openDialog) {
      cashier = getCashier($params.id);
      if (cashier) {
        ready = true;
        openDialog();
        approved = cashier.status === "APPROVED";
        rejected = cashier.status === "REJECTED";
        unapproved = cashier.status === "UNAPPROVED";
      }
    }
    if (approveGranted && unapproved) {
      approveButtonEnable = approveGranted && unapproved;
      rejectButtonEnable = approveGranted && unapproved;
    }
  }

  function closeHandler() {
    $goto(closeUrl, {});
  }

  async function approveHandler() {
    try {
      $loading = true;
      await approve(cashier.id);
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
      await reject(cashier.id);
      notify(`data berhasil berhasil direject`, "success");
      closeHandler();
    } catch (e) {
      notify(`data tidak berhasil direject`, "error");
    } finally {
      $loading = false;
    }
  }
</script>

<Modal title="Detail Data Kasir" bind:openDialog onClose={closeHandler}>
  <CashierView {cashier} />
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
