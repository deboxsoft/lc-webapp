<script lang="ts">
  import {get} from "svelte/store";
  import DropZone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  import TableStatementBank from "./TableStatementBank.svelte";
  import { createTransformBank } from "./_transform-csv";
  import { getBankStatementContext, getAccountContext } from "__@modules/accounting";
  import csvUtils from "papaparse";

  const { bank } = getBankStatementContext();
  const { getAccount } = getAccountContext();

  export let fileLoaded;
  export let isPreview;
  export let fileData;
  export let files;
  export let itemsSelected;
  export let errors;

  $: fileLoaded = $files.length > 0;

  function processRawCSV(data) {
    const output = [];
    let step = createTransformBank(output);
    csvUtils.parse(data, {
      step
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

</script>

<!--<div class="card bg-light mb-0">-->
  {#if !isPreview}
    <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
      <dl class="row mb-0">
        <dt class="col-sm-3 mb-0">Nama bank</dt>
        <p class="col-sm-9 mb-0">: <span class="font-weight-bold text-uppercase">{$bank.name}</span> {$bank.cabang ? `cabang ${$bank.branch}` : ""}</p>
        <dt class="col-sm-3 mb-0">No Rekening</dt>
        <p class="col-sm-9 mb-0">: {$bank.noAccountBank}</p>
        <dt class="col-sm-3 mb-0">An. Rekening</dt>
        <p class="col-sm-9 mb-0">: {$bank.nameAccountBank}</p>
        <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
        <p class="col-sm-9 mb-0">: {(get(getAccount($bank.accountId))).name}</p>
      </dl>
    </div>
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
<!--    </div>-->
    {:else}
    <TableStatementBank preview bankStatementList={$fileData} bind:itemsSelected bind:errors />
  {/if}

<!--</div>-->
