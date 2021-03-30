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
  import { onMount } from "svelte";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";

  let { class: className } = $$props;
  $: classes = clsx("modal-dialog", className);

  export let open = true;
  export let title = undefined;
  const events = getEventsAction(current_component);
  onMount(() => {
    return () => {
      open = false;
    };
  });
</script>

<div class="modal-backdrop fade" class:show={open} />

<div class="modal" class:show={open} use:events tabindex="-1" transition:fade={{ duration: 200 }}>
  <div {...$$restProps} class={classes}>
    <div class="modal-content">
      {#if $$slots["header"] || title}
        <div class="modal-header">
          <slot name="header">
            <h5 class="modal-title">{title}</h5>
          </slot>
        </div>
      {/if}
      <div class="modal-body">
        <slot />
      </div>
      {#if $$slots["footer"]}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss" global>
  .dbx-theme {
    .modal {
      &.show {
        display: block;
      }
    }
  }
</style>
