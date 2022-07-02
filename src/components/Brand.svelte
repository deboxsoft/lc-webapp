<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { url } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import initial from "initials";

  const { config } = getApplicationContext();
  const { companyStore } = stores.getCompanyContext();

  let imageFail, imageLoading, srcImg;
  $: {
    srcImg = $config.brandUrl;
    if (!srcImg) {
      imageLoading = true;
      imageFail = false;
    }
  }
</script>

<div class="navbar-brand text-center text-lg-left wmin-md-200">
  <a href={$url("/")} class="d-flex">
    {#if srcImg && !imageFail}
      <img
        src={srcImg}
        on:error={() => {
          imageLoading = false;
          imageFail = true;
        }}
        on:load={() => {
          imageFail = false;
          imageLoading = false;
        }}
      />
    {/if}
    <div>
      {#if srcImg && imageFail}
        {initial($companyStore.name)?.toUpperCase() || "LC"} |
      {/if}
      {$companyStore.unit || ""}
    </div>
  </a>
</div>
