<!--routify:options title="Proses Akhir Tahun"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { getAclContext } from "__@root/utils";

  let openDialog, bdd, desc;

  onMount(() => {
    openDialog();
  });

  const { query } = getAclContext();
  const closeReportGranted = query.create("closeReport").granted;
  const { periodEnd } = stores.getTransactionContext();
  const { loading, notify } = getApplicationContext();

  if (!closeReportGranted) {
    $goto("/access-denied");
  }

  async function processHandler() {
    $loading = true;
    try {
      await periodEnd($params.period);
      $loading = false;
      $goto("../");
      notify(`proses penutupan akhir tahun selesai.`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog title="Hapus bdd" onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan mereset data akhir tahun {dayjs().year()}?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tidak</button>
    <button class="btn bg-warning" on:click={processHandler}>Iya</button>
  </svelte:fragment>
</Modal>
