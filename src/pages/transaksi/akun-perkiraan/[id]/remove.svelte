<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { remove } = getAccountContext();

  let accountId;

  $: accountId = $params.id;

  async function removeHandler() {
    await remove(accountId);
    $goto("../");
  }

  function closeHandler() {
    $goto("../");
  }

</script>

<Modal open title="Hapus Content">
  <div class="alert alert-warning alert-styled-left">
    Menghapus akun akan berpengaruh pada transaksi. Apa anda yakin akan menghapus kode akun `{accountId}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
