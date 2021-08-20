<!--routify:options title="Hapus Data"-->
<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }
  const { remove, getBank } = stores.getBankContext();
  const { loading, notify } = getApplicationContext();
  let openDialog;
  onMount(() => {
    openDialog();
  })

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      closeHandler();
      notify(`berhasil menghapus data bank id '${$params.id}'`, "success");
    } catch (e) {
      $loading = false;
    }
  }

  $: bank = getBank($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog open title="Hapus Content" onClose={closeHandler}>
  {#if $loading || !$bank}
    <Loader />
  {:else}
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus bank "{$bank.name}"?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
