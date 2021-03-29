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
  import {onMount} from "svelte"

  export let open = true;
  export let title = undefined;
  const events = getEventsAction(current_component);
  onMount(() => {
    return () => {
      open = false;
    }
  })
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

<div class="modal-backdrop fade" class:show={open} />

<div class="modal" class:show={open} use:events tabindex="-1" transition:fade={{ duration: 200 }}>
  <div class="modal-dialog" {...$$restProps}>
    <div class="modal-content">
      {#if $$slots['header'] || title}
        <div class="modal-header">
          <slot name="header">
            <h5 class="modal-title">{title}</h5>
          </slot>
        </div>
      {/if}
      <div class="modal-body">
        <slot />
      </div>
      {#if $$slots['footer']}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
</div>
