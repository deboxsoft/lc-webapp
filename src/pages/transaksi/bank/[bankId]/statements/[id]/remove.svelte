<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  const { removeStatement, getStatement, bank } = stores.getBankStatementContext();
  const { notify, loading } = getApplicationContext();

  async function removeHandler() {
    $loading = true;
    try {
      await removeStatement($params.id, $bank.id);
      notify("data berhasil dihapus", "success");
      $goto("../");
      $loading = false;
    } catch (e) {
      $loading = false;
      notify(e.message, "error");
    }
  }

  $: statement = getStatement($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal open title="Hapus Statement">
  <div class="alert alert-warning alert-styled-left">Apa anda yakin akan menghapus data ini?</div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
