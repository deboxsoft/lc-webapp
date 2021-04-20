<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getBankStatementContext } from "__@modules/accounting";
  import Loader from "__@comps/loader/Loader.svelte";

  const { removeStatement, getStatement, bank } = getBankStatementContext();
  let loading = false;

  async function removeHandler() {
    loading = true;
    try {
      await removeStatement($params.id, $bank.id);
      loading = false;
      $goto("../");
    } catch (e) {
      loading = false;
      console.error(e);
    }
  }

  $: statement = getStatement($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal open title="Hapus Statement">
  {#if loading || !$statement}
    <Loader />
  {:else}
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus data ini?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
