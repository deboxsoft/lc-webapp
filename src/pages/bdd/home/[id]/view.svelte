<!--routify:options title="Detail Bdd"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import BddView from "../../_components/BddView.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { loading, notify } = getApplicationContext();
  const { bddDetail, approve, reject } = stores.getBddContext();
  const { createGranted } = getAclContext();

  const rejectButtonEnable = createGranted;
  const approveButtonEnable = createGranted;

  export let to = "../";
  let openDialog, bdd;

  bddDetail($params.id).then((_) => {
    bdd = _;
    openDialog();
  });

  async function approveHandler() {
    try {
      $loading = true;
      if (await approve(bdd.id)) {
        notify(`approve bdd id '${bdd.id}' berhasil diapprove`, "success");
        closeHandler();
      } else {
        notify(`approve bdd id '${bdd.id}' tidak berhasil diapprove`, "error");
      }
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
    $loading = true;
    if (await reject(bdd.id)) {
      notify(`reject bdd id '${bdd.id}' berhasil direject`, "success");
    } else {
      notify(`reject bdd id '${bdd.id}' tidak berhasil`, "error");
    }
    $loading = false;
    closeHandler();
  }

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Bdd" bind:openDialog onClose={closeHandler}>
  <BddView {bdd} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
    {#if rejectButtonEnable && bdd?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-danger" on:click={rejectHandler}> Reject </button>
    {/if}
    {#if approveButtonEnable && bdd?.status === "UNAPPROVED"}
      <button type="button" class="btn btn-primary" on:click={approveHandler}> Approve </button>
    {/if}
  </svelte:fragment>
</Modal>
