<script>
  export let message = "";
  export let open = false;
  export let type = "danger";
  function closeHandler() {
    open = false;
  }
</script>

{#if open}
  <div class="alert alert-dismissible alert-{type}">
    <button type="button" class="close" on:click={closeHandler}><span>x</span></button>
    <slot {message}>
      {message}
    </slot>
  </div>
{/if}

<style>
  .alert {
    padding: 0.5rem;
  }
  .alert-dismissible .close {
    padding: 0.5rem;
  }
</style>
