<script>
  export let isPageBody = false;
</script>

<style lang="scss">
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &.-page-body {
      width: 100vw;
      height: 100vh;
    }
  }
</style>

<div class="loader-container" class:-page-body={isPageBody}>
  <slot />
</div>
