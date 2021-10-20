<script context="module">
  import { writable } from "svelte/store";

  export let loading = writable(false);
</script>

<script>
  import { getApplicationContext } from "__@modules/app";
  import Avatar from "__@comps/Avatar.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  export let label = "";
  const { config } = getApplicationContext();
  export let src = $config.brandUrl;
  export let imageFail;
</script>

{#if $loading}
  <Loader />
{:else}
  <Avatar {...$$restProps} {label} bind:src bind:imageFail square initialDisable>
    <slot />
  </Avatar>
{/if}

<style lang="scss" global>
  .dbx-theme {
    .navbar-brand {
      img {
        height: 1.25rem;
        margin-right: 10px;
      }
    }
  }
</style>
