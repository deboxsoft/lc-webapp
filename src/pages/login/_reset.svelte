<script lang="ts">
  import { onMount } from "svelte";
  import { redirect } from "@roxi/routify";
  import { createAuthenticationContext } from "__@modules/users";
  import { createBaseApplicationContext } from "__@modules/app";

  const { env, fetch, notify, loading } = createBaseApplicationContext();
  const { profileStore } = createAuthenticationContext({ fetch, notify, env });

  onMount(() => {
    $loading = false;
  });
  /**
   *  We don't want the login page to visible to logged in user, so we redirect them
   **/
  $: if ($profileStore?.authenticated) $redirect("../");
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
