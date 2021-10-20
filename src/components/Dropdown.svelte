<script context="module">
  import { setContext, getContext } from "svelte";
  import { writable } from "svelte/store";

  export const createContextDropdown = () => {
    const store = writable({});
    setContext("dropdown-context", store);
    return store;
  };

  export const getContextDropdown = () => getContext("dropdown-context");
</script>
<script>
  import { onDestroy } from 'svelte';
  import { createPopperActions } from "__@root/utils";
  import DropdownMenu from "./DropdownMenu.svelte";
  import { clsx } from "@deboxsoft/module-client";

  const noop = () => undefined;
  export const context = createContextDropdown();
  export let className = $$props.class;
  export let active = false;
  export let addonType = false;
  export let direction = 'down';
  export let dropup = false;
  export let group = false;
  export let inNavbar = false;
  export let show = false;
  export let isOpen = show;
  export let nav = false;
  export let setActiveFromChild = false;
  export let size = '';
  export let toggle = undefined;
  export let menuProps = {};
  const [popperRef, popperContent] = createPopperActions();
  const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];
  if (validDirections.indexOf(direction) === -1) {
    throw new Error(
      `Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`
    );
  }
  let component;
  let dropdownDirection;
  $: subItemIsActive = !!(
    setActiveFromChild &&
    component &&
    typeof component.querySelector === 'function' &&
    component.querySelector('.active')
  );
  $: {
    if (direction === 'left') dropdownDirection = 'start';
    else if (direction === 'right') dropdownDirection = 'end';
    else dropdownDirection = direction;
  }
  $: classes = clsx(
    className,
    direction !== 'down' && `drop${dropdownDirection}`,
    nav && active ? 'active' : false,
    setActiveFromChild && subItemIsActive ? 'active' : false,
    {
      [`input-group-${addonType}`]: addonType,
      'btn-group': group,
      [`btn-group-${size}`]: !!size,
      dropdown: !group && !addonType,
      show: isOpen,
      'nav-item': nav
    }
  );
  $: {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        ['click', 'touchstart', 'keyup'].forEach((event) =>
          document.addEventListener(event, handleDocumentClick, true)
        );
      } else {
        ['click', 'touchstart', 'keyup'].forEach((event) =>
          document.removeEventListener(event, handleDocumentClick, true)
        );
      }
    }
  }
  $: {
    context.update(() => {
      return {
        toggle: handleToggle,
        isOpen,
        direction: direction === 'down' && dropup ? 'up' : direction,
        inNavbar,
        popperRef: nav ? noop : popperRef,
        popperContent: nav ? noop : popperContent
      };
    });
  }
  let handleToggle = toggle || (() => {
    return (isOpen = !isOpen);
  });
  function handleDocumentClick(e) {
    if (!isOpen) {
      return;
    }
    if (e && (e.which === 3 || (e.type === 'keyup' && e.which !== 9))) return;
    if (
      component.contains(e.target) &&
      component !== e.target &&
      (e.type !== 'keyup' || e.which === 9)
    ) {
      return;
    }
    handleToggle(e);
  }
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      ['click', 'touchstart', 'keyup'].forEach((event) =>
        document.removeEventListener(event, handleDocumentClick, true)
      );
    }
  });

  export const closeHandler = () => {
    isOpen = false;
  }
</script>

{#if nav}
  <li {...$$restProps} class={classes} bind:this={component}>
    <slot />
    <DropdownMenu {...menuProps}>
      <slot name="menu" />
    </DropdownMenu>
  </li>
{:else}
  <div {...$$restProps} class={classes} bind:this={component}>
    <slot />
    <DropdownMenu {...menuProps}>
      <slot name="menu" {closeHandler} />
    </DropdownMenu>
  </div>
{/if}
