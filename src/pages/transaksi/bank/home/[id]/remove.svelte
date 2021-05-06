<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getBankContext } from "__@modules/accounting";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { remove, getBank } = getBankContext();
  const { loading, notify } = getApplicationContext();

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus data bank id '${$params.id}'`);
    } catch (e) {
      $loading = false;
    }
  }

  $: bank = getBank($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal open title="Hapus Content">
  {#if loading || !$bank}
    <Loader />
  {:else}
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus bank "{$bank.bank}"?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
