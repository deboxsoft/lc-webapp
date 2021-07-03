<script>
  import { createEventDispatcher } from "svelte";
  import { clsx } from "@deboxsoft/module-client";
  import { getApplicationContext } from "__@modules/app";
  import Backdrop from "./utils/Backdrop.svelte";
  import Portal from "./utils/Portal.svelte";

  const { uiControl } = getApplicationContext();
  const dispatch = createEventDispatcher();

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;
  export let buttonCloseDisable = false;
  export let title = undefined;
  export let disableHeader = false;
  export let theme = undefined;
  export let className = $$props.class;
  export let initialFocusElement = undefined;
  export let returnFocusElement = undefined;
  export let ariaModalLegacy = false;
  export const openDialog = () => {
      _open = true;
  };

  export const closeDialog = () => {
    onClose && onClose()
    _open = false;
  }

  let _open = false

  $: classes = clsx("modal-dialog modal-dialog-centered", className);

  function closeHandler() {
    closeDialog();
  }
</script>

{#if _open}
  <Portal class="modal">
    <Backdrop onClose={closeHandler} {initialFocusElement} {ariaModalLegacy} {returnFocusElement}>
      <div {...$$restProps} class={classes}>
        <div class="modal-content">
          {#if $$slots["header"] || title || onClose}
            <div class={clsx("modal-header", theme && `bg-${theme}`)}>
              {#if $$slots["header"] || title}
                <slot name="header">
                  <h5 class="modal-title">{title}</h5>
                </slot>
              {/if}
              {#if !buttonCloseDisable}
                <button type="button" class="close" data-dismiss="modal" on:click={closeHandler}>×</button>
              {/if}
            </div>
          {/if}
          <div class="modal-body">
            <slot />
          </div>
          {#if $$slots["footer"]}
            <div class={clsx("modal-footer", theme && `bg-${theme}`)}>
              <slot name="footer" />
            </div>
          {/if}
        </div>
      </div>
    </Backdrop>
  </Portal>
{/if}

<style lang="scss" global>
  .dbx-theme {
    .dbx-modal {
      z-index: 1000;
    }
    .modal {
      position: fixed;
      z-index: 1000;
      display: block;
      .card {
        margin-bottom: unset;

        .card-header,
        .card-body,
        .card-footer {
          padding: 1rem;
        }
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }

      .modal-header:not([class*="bg-"]) {
        padding-bottom: 0;
        border-bottom-width: 0;
      }

      .modal-footer:not([class*="bg-"]) {
        padding-top: 0;
        border-top-width: 0;
      }

      .form-group {
        margin-bottom: 1rem;
      }
    }
  }
</style>
