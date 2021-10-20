<script>
  import { url } from "@roxi/routify";
  export let label;
  export let path = "/";
  export let iconClass;
  export let show = false;
</script>

{#if show}
  <div class="col-lg-2">
    <div class="card">
      <div class="card-body">
        <a href={$url(path)} class="d-flex align-items-center justify-content-center flex-column menu-card-link">
          <i class="{iconClass} icon-4x mb-2 mt-2" />
          <div class="text-body">{label}</div>
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .menu-card-link {
    color: #333;
  }
</style>
