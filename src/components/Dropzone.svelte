<script lang="ts">

  export let options: Record<string, any> = {previewTemplate: "<div />"};
  export let autoDiscover: boolean = false;
  export let events: Record<string, any> = {}

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
