<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { remove } = getAccountContext();
  const { notify, loading } = getApplicationContext();
  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }

  let accountId;

  $: accountId = $params.id;

  async function removeHandler() {
    try {
      $loading = true;
      await remove(accountId);
      $goto("../");
      notify(`kode akun '${accountId}' berhasil dihapus`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal open title="Hapus Content" onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Menghapus akun akan berpengaruh pada transaksi. Apa anda yakin akan menghapus kode akun `{accountId}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
