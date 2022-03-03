<script>
  import { createEventDispatcher } from "svelte";
  import { clsx } from "@deboxsoft/module-client";
  import { getApplicationContext } from "__@modules/app";
  import Backdrop from "./utils/Backdrop.svelte";
  import Portal from "./utils/Portal.svelte";
  import Loader from "./loader/Loader.svelte";

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
  export let scrollable = false;
  export let loading = false;
  export const openDialog = () => {
    _open = true;
  };

  export const closeDialog = () => {
    onClose && onClose();
    _open = false;
  };

  let _open = false;

  $: classes = clsx("modal-dialog modal-dialog-centered", className, scrollable && "-scrollable");

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
            {#if !loading}
              <slot />
            {:else}
              <Loader />
            {/if}
          </div>
          {#if $$slots["footer"] && !loading}
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

      .modal-body {
        min-height: 250px;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }

      .modal-header:not([class*="bg-"]) {
        padding-bottom: 0.5rem;
        border-bottom-width: 1px;
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

  .modal-dialog {
    &.-scrollable {
      height: calc(100% - 3.5rem);
      .modal-content {
        max-height: 100%;
        overflow: hidden;
      }

      .modal-body {
        overflow-y: auto;
        min-height: unset;
      }
    }
  }
</style>
