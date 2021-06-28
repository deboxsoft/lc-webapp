<script>
  import { fade } from "svelte/transition";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { getModalManager } from "@deboxsoft/svelte-core";
  import TrackFocus from "@deboxsoft/svelte-core/TrapFocus.svelte";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getApplicationContext } from "__@modules/app";

  const { uiControl } = getApplicationContext();
  const modalManager = getModalManager();
  const dispatch = createEventDispatcher();

  export let onClose = () => {};
  export let container = undefined;
  export let open = true;
  export let title = undefined;
  export let disableScrollLock = false;
  export let disableBackdropClick = false;
  export let disableHeader = false;
  export let hideBackdrop = false;
  export let className = $$props.class;
  export let transitionDuration = 300;

  export let onEscapeKeyDown = () => {
    closeHandler();
  };
  $: classes = clsx("modal-dialog modal-dialog-centered", className);

  let uiStore = uiControl.store;
  let mounted = false;
  let modalEl;
  onMount(() => {
    if (!container) {
      container = window.document.body;
    }
    $uiStore.modalOpen = open;
    mounted = true;
  });

  onDestroy(() => {
    open = false;
    $uiStore.modalOpen = false;
  })

  function closeHandler() {
    const index = modalManager.remove(modalEl);
    onClose();
    open = false;
    $uiStore.modalOpen = false;
  }

  export function openHandler() {
    modalManager.add(modalEl, container);
    modalManager.mount(modalEl, { disableScrollLock });
    modalEl.scrollTop = 0;
    $uiStore.modalOpen = true;
  }

  function backdropClickHandler(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (!disableBackdropClick) {
      closeHandler();
    }
  }

  /**
   *
   * @param e {KeyboardEvent}
   */
  function keydownHandler(e) {
    if (e.key !== "Escape" || !modalManager.isTopModal(modalEl)) {
      return;
    }
    e.stopPropagation();
    closeHandler();
  }

  function transitionEnteringHandler() {
    dispatch("entering");
  }

  function transitionEnteredHandler() {
    dispatch("entered");
  }

  function transitionExitedHandler() {
    closeHandler();
    dispatch("exited");
  }

  function transitionExitingHandler() {
    dispatch("exiting");
  }
</script>
{#if open}
  <div class="modal" class:show={open} tabindex="-1" transition:fade|local={{ duration: 200 }}>
    <!--    backdrop -->
    {#if !hideBackdrop}
      <div class="backdrop" on:click={backdropClickHandler} />
    {/if}
    <TrackFocus enable={modalManager.isTopModal(modalEl)} {open}>
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
    </TrackFocus>
  </div>
{/if}

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
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
</style>
