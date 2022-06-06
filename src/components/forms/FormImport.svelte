<script>
  import { writable } from "svelte/store";
  import DropZone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  import { csvParse } from "__@root/utils";
  import Modal from "__@comps/Modal.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { loading, notify } = getApplicationContext();
  export let fileLoaded = false;
  export let isPreview = false;
  export let title = "";
  export let files = writable([]);
  export let openDialog;
  export let closeDialog;
  export let errors = [];
  export let transformStep = (output) => (_) => output.push(_);
  export let onSubmit = () => {
    return Promise.resolve();
  };
  export let onClose = () => {};
  export let onReset = () => {};
  export let onPreview = () => {};

  const { class: className = "modal-lg" } = $$props;

  let fileData = writable([]);

  let alertMessage = "";
  /**
   * @type{ "verified" | "unverified" | "error" | "process" | "success" | "failed" }
   */
  let statusFormState = "unverified";

  $: fileLoaded = $files.length > 0;

  function processRawCSV(data) {
    const output = [];
    csvParse(data, {
      step: transformStep(output)
    });
    fileData.set(output);
  }

  function handleFileSelect(e) {
    $files = e.detail.acceptedFiles;
    $files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        processRawCSV(binaryStr);
      };
      reader.readAsText(file, "UTF-8");
    });
  }

  async function submitHandler() {
    try {
      $loading = true;
      statusFormState = "process";
      await onSubmit($fileData);
      notify("data berhasil disimpan", "success");
      statusFormState = "success";
      closeHandler();
    } catch (e) {
      if (e?.message) {
        notify(e?.message || `data tidak berhasil disimpan`, e.type || "error");
      } else {
        console.error(e);
      }
      statusFormState = "failed";
    } finally {
      $loading = false;
    }
  }

  function resetHandler() {
    isPreview = false;
    fileLoaded = false;
    files.set([]);
    errors = [];
    statusFormState = "unverified";
    alertMessage = undefined;
    onReset();
  }

  function closeHandler() {
    onClose();
  }

  function previewHandler() {
    try {
      isPreview = true;
      onPreview($fileData);
      if (errors.length > 0) {
        throw new Error("Data tidak lengkap, mohon diperiksa kembali.");
      }
      statusFormState = "verified";
    } catch (e) {
      statusFormState = "unverified";
      notify(e.message, "error");
      alertMessage = {
        message: e.message,
        type: "error"
      };
    }
  }

  function alertDismissHandler() {
    alertMessage = undefined;
  }
</script>

<Modal bind:openDialog bind:closeDialog {title} class={className} onClose={closeHandler} scrollable theme="white">
  {#if $loading}
    <Loader />
  {:else}
    {#if alertMessage}
      <div class="alert alert-dismissible border-0" class:alert-danger={alertMessage.type === "error"}>
        <button type="button" class="close" on:click={alertDismissHandler}><span>x</span></button>
        {alertMessage.message}
      </div>
    {/if}
    <slot name="info" />
    {#if !isPreview}
      <DropZone on:drop={handleFileSelect} accept=".csv" multiple={false} disableDefaultStyles>
        <div class="dropzone mt-2">
          <div class="dz-default dz-message"><span>Drop files CSV <span>or CLICK</span></span></div>
          {#each $files as file}
            <div class="dz-preview dz-file-preview">
              <div class="dz-details">
                <div class="dz-filename"><span data-dz-name>{file.name}</span></div>
                <div class="dz-size" data-dz-size>{file.size}</div>
                <div class="dz-size">{file.lastModifiedDate}</div>
                <img alt="csv file" data-dz-thumbnail />
              </div>
              <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress /></div>
              <div class="dz-success-mark"><span>✔</span></div>
              <div class="dz-error-mark"><span>✘</span></div>
              <div class="dz-error-message"><span data-dz-errormessage /></div>
            </div>
          {/each}
        </div>
      </DropZone>
    {:else}
      <slot fileData={$fileData} />
    {/if}
  {/if}
  <div slot="footer">
    <button type="button" on:click={closeHandler} class="btn btn-outline-primary mr-2"
      ><i class="icon-cancel-circle2 mr-2" />Tutup</button
    >
    {#if !isPreview}
      <button type="button" on:click={previewHandler} class="btn bg-primary mr-2" disabled={!fileLoaded}
        ><i class="icon-file-eye2 mr-2" />preview</button
      >
    {:else}
      <button type="button" on:click={resetHandler} class="btn btn-outline-primary mr-2"
        ><i class="icon-reset mr-2" />Reset</button
      >
      <button
        type="button"
        on:click={submitHandler}
        class="btn btn-primary mr-2"
        disabled={statusFormState !== "verified"}><i class="icon-floppy-disk mr-2" />Simpan</button
      >
    {/if}
  </div>
</Modal>
