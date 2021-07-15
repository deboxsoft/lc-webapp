<script>

  export let options = {previewTemplate: "<div />"};
  export let autoDiscover = false;
  export let events = {}

  const {class: className} = $$props;

  /**
   *
   * @param el
   * @param config @url{https://www.dropzonejs.com/#configuration-options}
   */
  function dropzone(el, config: any) {
    return {
      update(config) {
        return {
          destroy() {}
        }
      }
    }
  }

</script>

<div class={className} {...$$restProps} use:dropzone={options}>
  <slot />
  <input hidden type="file"/>
</div>
