<script>
  import i from "initials";
  import { afterUpdate, onDestroy, tick } from "svelte";
  import FilePond from "filepond";
  import locale_id from "filepond/locale/id-id.js";
  import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
  import FilePondPluginImageTransform from "filepond-plugin-image-transform";
  import FilePondPluginImageCrop from "filepond-plugin-image-crop";
  import FilePondPluginImageResize from "filepond-plugin-image-resize";
  import { getApplicationContext } from "__@modules/app";
  import AvatarBrand, { loading } from "__@root/layout/AvatarBrand.svelte";

  FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );
  const { config } = getApplicationContext();

  export let name = "brand";
  export let size = undefined;

  const initial = i(name).toUpperCase();

  export let options = {
    name: "brand",
    credits: false,
    // allowRemove: false,
    // allowRevert: false,
    captureMethod: "camera",
    allowProcess: true,
    stylePanelLayout: "compact circle",
    styleLoadIndicatorPosition: "center bottom",
    styleProgressIndicatorPosition: "right bottom",
    styleButtonRemoveItemPosition: "left bottom",
    styleButtonProcessItemPosition: "right bottom",
    imagePreviewHeight: 170,
    imageCropAspectRatio: "1:1",
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    imageTransformOutputMimeType: "image/png",
    oninit,
    onerror,
    oninitfile,
    onprocessfile,
    onaddfile,
    ...locale_id,
    labelIdle: `
      <div classs="fileFond--label-action">
        ${initial}
      </div>
      <div class="card-img-actions-overlay card-img">
        <div
          class="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round"
          style="cursor: pointer"
        >
        <i class="icon-plus3"></i>
        </div>
      </div>
    `
  };

  let el;
  let src;
  let instance;
  let isSupported = FilePond.supported();
  let imageFail;
  afterUpdate(() => {
    if (!isSupported) {
      return;
    }
    const baseConfigServer = {
      url: $config.brandUploadPath
    };
    const _options = {
      ...options,
      ...{
        server: {
          url: $config.brandUploadUrl,
          process: baseConfigServer,
          revert: baseConfigServer,
          load: baseConfigServer,
          fetch: baseConfigServer
        }
      }
    };
    if (!instance) {
      instance = FilePond.create(_options);
    } else {
      instance.setOptions(_options);
    }
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
      instance = undefined;
    }
  });

  function oninit() {}

  function onwarning() {}

  function onerror(e) {}

  function oninitfile() {}

  function onprocessfile(error, file) {
    console.log(file);
    tick().then(() => {
      $loading = false;
    });
  }

  function onaddfile(err, fileItem) {}

  async function inputFileHandler({ target }) {
    $loading = true;
    const result = await instance.addFile(target.files[0]);
    instance.processFile();
  }
</script>

<div class="card-img-actions">
  <AvatarBrand size="150px" {src} bind:imageFail>
    {#if imageFail}
      <div class="card-brand-image-overlay card-img border" style="border-radius: 0.25rem;">
        <label>
          <div
            class="btn btn-outline btn-icon"
            style="cursor: pointer; border-radius: 0.25rem; width: 150px; height: 150px;"
          >
            <i class="icon-plus3" />
          </div>
          <input type="file" style="display: none" on:input={inputFileHandler} accept="image/png,image/jpeg" />
        </label>
      </div>
    {:else}
      <div class="card-img-actions-overlay card-img">
        <label>
          <div
            class="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round"
            style="cursor: pointer"
          >
            <i class="icon-plus3" />
          </div>
          <input type="file" style="display: none" on:input={inputFileHandler} accept="image/png,image/jpeg" />
        </label>
      </div>
    {/if}
  </AvatarBrand>
</div>

<style lang="scss">
  .border {
    border: 2px dashed #ddd !important;
  }
  .card-brand-image-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #ccc;
    transition: all ease-in-out 0.15s;

    label {
      margin-bottom: 0;
    }

    .btn:hover {
      background-color: grey;
    }
  }
</style>
