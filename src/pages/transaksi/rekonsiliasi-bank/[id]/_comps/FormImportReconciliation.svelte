<script lang="ts">
  import DropZone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  import { writable } from "svelte/store";
  import { getStoreContext } from "../_store";
  import csvUtils from "papaparse";
  import {getApplicationContext} from "__@modules/app"

  const { bankReconciliation, fileDataImport } = getStoreContext();
  const {notify} = getApplicationContext();

  export let fileLoaded;
  const split = ";"

  let files = writable([]);

  $: fileLoaded = $files.length > 0;

  function _sanitizeString(_val: string) {
    // console.log(_val.trim(), _val);
    return _val.trim().replace(/\s+/g, ' ');
  }

  function _sanitizeNumber(_val: string) {
    _val = _val.replace(/,/g, "");
    return parseInt(_val);
  }
  function processRawCSV(data) {
    const output = [];
    const {result, error } = csvUtils.parse(data, {
      transform: (_cells) => ({
        date: _cells[0],
        description: _sanitizeString(`${_cells[1]}`),
        in: _sanitizeNumber(_cells[2]),
        out: _sanitizeNumber(_cells[3]),
        balance: _sanitizeNumber(_cells[4])
      })
    });
    if (Array.isArray(error)) {
      notify("parsing csv error: " + error[0].message, "error");
      return [];
    } else {
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
