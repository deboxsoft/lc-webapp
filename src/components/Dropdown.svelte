<script lang="ts" context="module">
  type OnEvent = (args?: any) => void;
  type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end"
</script>
<script lang="ts">
  import type { Instance as PopperInstance } from "@popperjs/core";
  import { onMount, onDestroy, tick } from "svelte";
  import { createPopper } from "@popperjs/core/dist/umd/popper-lite";

  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  const noop = () => {};
  export let open: boolean = false;
  export let flip: boolean = true;
  export let placement: Placement = "bottom-start";
  export let displayStatic: boolean = false;
  export let keyboard: boolean = true;
  export let insideClick: boolean = false;
  export let closeOnOutsideClick: boolean = true;
  export let offset: number[] = [0, 2];
  export let menuClass: string = undefined;
  export let buttonClass: string = "";
  export let triggerElement: Element;
  export let onOpened: OnEvent = noop;
  export let onClosed: OnEvent = noop;
  export let labelledby: string | undefined = undefined;
  export let isNavItem: boolean = false;
  let { class: className } = $$props;

  let _classes: string | undefined;
  let _menuItem: HTMLElement;
  let _popperInstance: PopperInstance | undefined;
  let _keyboardEvent: { remove: typeof noop };
  let _outsideClickEvent: { remove: typeof noop };
  let _triggerEvent: { remove: typeof noop };
  let _items: HTMLElement[] = [];

  const ESCAPE_KEY = "Escape";
  const ARROW_UP_KEY = "ArrowUp";
  const ARROW_DOWN_KEY = "ArrowDown";
  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
  const SELECTOR_VISIBLE_ITEMS = ".dropdown-item:not(.disabled):not(:disabled)";
  const placementClassMap = {
    top: "dropup",
    bottom: "dropdown",
    right: "dropright",
    left: "dropleft"
  };

  $: {
    if (open) {
      onDropdownOpened();
    } else {
      onDropdownClosed();
    }
  }
  $: _classes = clsx(className, placementClassMap[placement.split("-")[0]], isNavItem && "nav-item");

  function attachEvent(
    target: HTMLElement | Document | Element,
    type: string,
    onEvent: EventListener | EventListenerObject
  ) {
    target.addEventListener(type, onEvent);
    return {
      remove: () => target.removeEventListener(type, onEvent)
    };
  }
  function menuClick() {
    if (!insideClick) {
      open = false;
    }
  }
  async function _createPopperInstance() {
    await tick();
    _popperInstance = createPopper(triggerElement, _menuItem, {
      placement,
      modifiers: [
        {
          name: "flip",
          phase: "main",
          enabled: flip
        },
        {
          name: "offset",
          options: {
            offset
          }
        },
        {
          name: "preventOverflow",
          options: {
            altBoundary: true
          }
        }
      ]
    });
  }
  function _isVisible(element: HTMLElement) {
    if (!element) {
      return false;
    }
    let _parentNode = element.parentElement;
    if (element.style && _parentNode && _parentNode.style) {
      const elementStyle = getComputedStyle(element);
      const parentNodeStyle = getComputedStyle(_parentNode);
      return (
        elementStyle.display !== "none" && parentNodeStyle.display !== "none" && elementStyle.visibility !== "hidden"
      );
    }
    return false;
  }
  async function getItems() {
    await tick();
    const nodeList = _menuItem.querySelectorAll(SELECTOR_VISIBLE_ITEMS);
    nodeList.forEach((e: HTMLElement) => {
      if (_isVisible(e)) {
        _items.push(e);
      }
    });
  }
  function _keyBoardEvents() {
    if (keyboard) {
      _keyboardEvent = attachEvent(document, "keydown", (event: KeyboardEvent) => {
        const target: any = event.target || {};
        if (!/input|textarea/i.test(target.tagName) && REGEXP_KEYDOWN.test(event.key)) {
          event.preventDefault();
          event.stopPropagation();
          if (event.key === ESCAPE_KEY) {
            open = false;
          }
          if (!_items.length) {
            return;
          }
          let index = _items.indexOf(event.target as HTMLElement);
          if (event.key === ARROW_UP_KEY && index > 0) {
            // Up
            index--;
          }
          if (event.key === ARROW_DOWN_KEY && index < _items.length - 1) {
            // Down
            index++;
          }
          // index is -1 if the first keydown is an ArrowUp
          index = index === -1 ? 0 : index;
          _items[index].focus();
        }
      });
    }
  }
  function _outsideEventAttacher() {
    if (closeOnOutsideClick) {
      _outsideClickEvent = attachEvent(document, "click", (event: Event) => {
        if (event.target !== _menuItem && !_menuItem.contains(event.target as HTMLElement)) {
          open = false;
        }
      });
    }
  }
  async function onDropdownOpened() {
    getItems();
    _keyBoardEvents();
    _outsideEventAttacher();
    if (!displayStatic) {
      _createPopperInstance();
    }
    onOpened && onOpened();
  }
  function _commonExit() {
    if (_keyboardEvent) {
      _keyboardEvent.remove();
    }
    if (_outsideClickEvent) {
      _outsideClickEvent.remove();
    }
    _destroyPopperInstance();
  }
  function onDropdownClosed() {
    _commonExit();
    onClosed && onClosed();
  }
  function _destroyPopperInstance() {
    if (_popperInstance) {
      _popperInstance.destroy();
      _popperInstance = undefined;
    }
  }
  onMount(async () => {
    await tick();
    if (triggerElement) {
      _triggerEvent =
        triggerElement &&
        attachEvent(triggerElement, "click", (event: Event) => {
          event.stopPropagation();
          open = !open;
        });
    }
  });
  onDestroy(() => {
    _commonExit();
    _triggerEvent.remove();
  });
</script>

{#if isNavItem}
  <li class={_classes} class:show={open}>
    <slot />
    {#if open}
      <div
        class="dropdown-menu show {menuClass}"
        bind:this={_menuItem}
        on:click={menuClick}
        style="margin: 0;"
        aria-labelledby={labelledby}>
        <slot name="dropdown-menu" />
      </div>
    {/if}
  </li>
{:else}
  <div class={_classes} class:show={open}>
    <slot />
    {#if open}
      <div
        class="dropdown-menu show {menuClass}"
        bind:this={_menuItem}
        on:click={menuClick}
        style="margin: 0;"
        aria-labelledby={labelledby}>
        <slot name="dropdown-menu" />
      </div>
    {/if}
  </div>
{/if}
