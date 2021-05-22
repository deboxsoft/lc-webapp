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
  import { getAuthenticationContext } from "__@modules/users";
  import Avatar, { submitting } from "__@comps/Avatar.svelte";

  FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );
  const { config } = getApplicationContext();
  const { authenticationStore } = getAuthenticationContext();

  export let name = "profile";
  export let size = undefined;

  const initial = i(name).toUpperCase();
  $: profile = $authenticationStore.profile;

  export let options = {
    name: "avatar",
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
  let imageFail = false;
  afterUpdate(() => {
    if (!isSupported) {
      return;
    }
    const baseConfigServer = {
      url: $config.avatarUploadPath,
      headers: {
        "user-id": profile.id,
        avatar: profile.avatar
      }
    };
    const _options = {
      ...options,
      ...{
        server: {
          url: $config.avatarUploadUrl,
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
    profile.avatar = file.serverId;
    $authenticationStore = { ...$authenticationStore, ...{ profile } };
    tick().then(() => {
      $submitting = false;
    });
  }

  function onaddfile(err, fileItem) {}

  async function inputFileHandler({ target }) {
    $submitting = true;
    const result = await instance.addFile(target.files[0]);
    instance.processFile();
  }
</script>

<div class="card-img-actions">
  <!--{#if !instance || instance.status <= 1}-->
  <Avatar size="150px" {src} {submitting}>
    <div class="card-img-actions-overlay rounded-circle card-img">
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
  </Avatar>
</div>
