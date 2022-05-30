<script>
  import { url } from "@roxi/routify";
  import IconExclamation from "@deboxsoft/svelte-icons/ico/IcoNotificationIcon.svelte";
</script>

<div class="main-layout">
  <div class="content d-flex justify-content-center align-items-center">
    <div class="row">
      <div class="col-md-2 text-center">
        <div style="width: 40px; height: 40px">
          <IconExclamation />
        </div>
      </div>
      <div class="col-md-10">
        <h5>Maaf, Anda tidak diijinkan mengakses halaman ini.</h5>
        <div>
          <a href={$url("/")}>home</a>
        </div>
        <div>
          <a
            href="/#"
            on:click|preventDefault={() => {
              window.history.go(-2);
            }}
            target="_self">back</a
          >
        </div>
      </div>
    </div>
  </div>
</div>
