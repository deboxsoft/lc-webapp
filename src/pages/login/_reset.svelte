<script lang="ts">
  import { authStore } from "__@root/store/auth";
  import { redirect } from "@roxi/routify";
  const { user } = authStore;
  /**
   *  We don't want the login page to visible to logged in user, so we redirect them
   **/
  $: if ($user) $redirect("../app");
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
