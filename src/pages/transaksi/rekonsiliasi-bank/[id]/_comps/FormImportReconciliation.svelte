<script lang="ts">
  import DropZone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  import {TEMPLATE_PARSE, bank_standard_transform, bni_transform, bank_mandiri_transform } from "./_transform-csv";
  import { writable } from "svelte/store";
  import { getStoreContext } from "../_store";
  import csvUtils from "papaparse";
  import { getApplicationContext } from "__@modules/app";

  const { bankReconciliation, fileDataImport, update } = getStoreContext();
  const { notify } = getApplicationContext();

  const templateKeys = Object.keys(TEMPLATE_PARSE);

  export let fileLoaded;
  let templateType: keyof typeof TEMPLATE_PARSE = "STANDARD";
  let files = writable([]);

  $: fileLoaded = $files.length > 0;

  function _sanitizeString(_val: string) {
    // console.log(_val.trim(), _val);
    return _val.trim().replace(/\s+/g, " ");
  }

  function _sanitizeNumber(_val: string) {
    _val = _val.replace(/,/g, "");
    return parseInt(_val);
  }
  function processRawCSV(data) {
    const output = [];
    let step;
    console.log(templateType);
    switch (templateType) {
      case "BNI":
        step = bni_transform
        break;
      case "MANDIRI":
        step = bank_mandiri_transform
        break;
      case "STANDARD":
      default:
        step = bank_standard_transform
    }

    const result = csvUtils.parse(data, {
      step
    });
    if (Array.isArray(result.error)) {
      notify("parsing csv error: " + error[0].message, "error");
      return [];
    } else {
      console.log(result);
      return result;
    }
  }

  function handleFileSelect(e) {
    $files = e.detail.acceptedFiles;
    $files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        $fileDataImport = processRawCSV(binaryStr);
      };
      reader.readAsText(file, "UTF-8");
    });
  }
</script>

<div class="card border-top-info bg-light mb-0">
  <div class="card-header">
    <div class="card card-body bg-light mb-0">
      <dl class="row mb-0">
        <dt class="col-sm-3">Nama bank</dt>
        <p class="col-sm-9"><span class="font-weight-bold text-uppercase">{bankReconciliation.bank}</span></p>

        <dt class="col-sm-3">No Rekening</dt>
        <p class="col-sm-9">{bankReconciliation.accountBank}</p>

        <dt class="col-sm-3">An. Rekening</dt>
        <p class="col-sm-9">{bankReconciliation.nameAccountBank}</p>

        <dt class="col-sm-3">Template</dt>
        <select class="col-sm-9 form-control" bind:value={templateType}>
          {#each templateKeys as _templateKey }
            <option value={_templateKey}>{TEMPLATE_PARSE[_templateKey]}</option>
          {/each}
        </select>
      </dl>
    </div>
  </div>
  <div class="card-body">
    <DropZone on:drop={handleFileSelect} accept=".csv" multiple={false} disableDefaultStyles>
      <div class="dropzone">
        <div class="dz-default dz-message"><span>Drop files CSV <span>or CLICK</span></span></div>
        {#each $files as file}
          <div class="dz-preview dz-file-preview">
            <div class="dz-details">
              <div class="dz-filename"><span data-dz-name>{file.name}</span></div>
              <div class="dz-size" data-dz-size>{file.size}</div>
              <div class="dz-size">{file.lastModifiedDate}</div>
              <img data-dz-thumbnail />
            </div>
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress /></div>
            <div class="dz-success-mark"><span>✔</span></div>
            <div class="dz-error-mark"><span>✘</span></div>
            <div class="dz-error-message"><span data-dz-errormessage /></div>
          </div>
        {/each}
      </div>
    </DropZone>
  </div>
</div>
