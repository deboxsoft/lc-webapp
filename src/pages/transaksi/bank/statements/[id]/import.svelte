<!--routify:options title="Import Statement"-->
<script>
  import { goto } from "@roxi/routify";
  import FormImport from "./_components/FormImport.svelte";
  import Modal from "__@comps/Modal.svelte";
  import { writable } from "svelte/store";
  import { getBankStatementContext } from "__@modules/accounting";

  const { importStatement, bank } = getBankStatementContext();
  let fileLoaded = false;
  let isPreview = false;
  let fileData = writable(undefined);
  let files = writable([]);

  async function submitHandler() {
    try {
      await importStatement($bank.id, $fileData);
      $goto("./");
    } catch (e) {}
  }

  function previewHandler() {
    isPreview = true;
  }

  function backHandler() {
    isPreview = false;
    fileLoaded = false;
    files.set([]);
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<Modal title="Import Statement Bank" class="modal-full">
  <FormImport bind:fileLoaded bind:fileData bind:isPreview bind:files />
  <div slot="footer">
    <button type="button" on:click={cancelHandler} class="btn btn-outline-primary mr-2"
      ><i class="icon-cancel-circle2 mr-2" />Tutup</button
    >
    {#if !isPreview}
      <button type="button" on:click={previewHandler} class="btn bg-blue-400 mr-2" disabled={!fileLoaded}
        ><i class="icon-file-eye2 mr-2" />preview</button
      >
    {:else}
      <button type="button" on:click={backHandler} class="btn btn-outline-primary mr-2"
        ><i class="icon-reset mr-2" />Reset</button
      >
      <button type="button" on:click={submitHandler} class="btn bg-blue-400 mr-2" disabled={!fileLoaded}
        ><i class="icon-file-eye2 mr-2" />Simpan</button
      >
    {/if}
  </div>
</Modal>
