<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Modal from "@deboxsoft/svelte-components-base/utils/Modal.svelte";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getApplicationContext } from "__@modules/app";

  const { uiControl } = getApplicationContext();

  export let onClose = undefined;

  export let onEscapeKeyDown = () => {
    closeHandler();
  };
  let { class: className } = $$props;
  $: classes = clsx("modal-dialog modal-dialog-centered", className);

  export let open = true;
  export let title = undefined;
  let uiStore = uiControl.store;
  onMount(() => {
    $uiStore.modalOpen = true;
    return () => {
      open = false;
      $uiStore.modalOpen = false;
    };
  });

  function closeHandler() {
    onClose && onClose();
  }
</script>

<Modal {onClose} {open} class={clsx("modal", open && "show")} disableBackdropClick={false} {onEscapeKeyDown}>
  <div class="modal" class:show={open} tabindex="-1" transition:fade={{ duration: 200 }}>
    <div {...$$restProps} class={classes}>
      <div class="modal-content">
        {#if $$slots["header"] || title || onClose}
          <div class="modal-header bg-light">
            {#if $$slots["header"] || title}
              <slot name="header">
                <h5 class="modal-title">{title}</h5>
              </slot>
            {/if}
            {#if onClose}
              <button type="button" class="close" data-dismiss="modal" on:click={closeHandler}>×</button>
            {/if}
          </div>
        {/if}
        <div class="modal-body">
          <slot />
        </div>
        {#if $$slots["footer"]}
          <div class="modal-footer bg-light">
            <slot name="footer" />
          </div>
        {/if}
      </div>
    </div>
  </div>
</Modal>

<style lang="scss" global>
  .dbx-theme {
    .dbx-modal {
      z-index: 1000;
    }
    .modal {
      position: fixed;
      z-index: 1000;
      &.show {
        display: block;
      }
    }
  }
</style>
