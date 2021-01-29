<script lang="ts" context="module">
  import { current_component, bubble, listen } from "svelte/internal";

  function getEventsAction(component) {
    return (node) => {
      const events = Object.keys(component.$$.callbacks);
      const listeners = [];

      events.forEach((event) => listeners.push(listen(node, event, (e) => bubble(component, e))));

      return {
        destroy: () => {
          listeners.forEach((listener) => listener());
        }
      };
    };
  }
</script>

<script>
  import { fade } from "svelte/transition";

  export let open = false;
  const events = getEventsAction(current_component);
  let is_header = $$props.$$slots && $$props.$$slots.header !== undefined;
  let is_footer = $$props.$$slots && $$props.$$slots.footer !== undefined;
</script>

<style lang="scss" global>
  .dbx-theme {
    .modal {
      &.show {
        display: block;
      }
    }
  }
</style>

<div
  class="modal fade"
  class:show={open}
  tabindex="-1"
  transition:fade={{ duration: 200 }}
  on:click={(e) => (open = false)}>
  <div class="modal-dialog" use:events {...$$restProps}>
    <slot />
  </div>
</div>
