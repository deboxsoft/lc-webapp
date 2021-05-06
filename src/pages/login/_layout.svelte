<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { onMount } from "svelte";
  import { redirect } from "@roxi/routify";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { authenticationStore } = getAuthenticationContext();
  const { loading } = getApplicationContext();

  onMount(() => {
    $loading = false;
  });
  /**
   *  We don't want the login page to visible to logged in user, so we redirect them
   **/
  $: if ($authenticationStore?.authenticated) $redirect("../");
</script>

<!-- Page content -->
<div class="main-layout">
  <div class="page-content">
    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Content area -->
      <div class="content d-flex justify-content-center align-items-center">
        <slot />
      </div>
    </div>
  </div>
</div>
