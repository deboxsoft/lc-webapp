<script context="module">
  import { setContext, getContext } from "svelte";
  import { writable } from "svelte/store";

  export let createContextDropdown = () => {
    const store = writable({});
    setContext("dropdown-context", store);
    return store;
  };

  export let getContextDropdown = () => getContext("dropdown-context");
</script>

<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";

  const dropdownStore = createContextDropdown();
  export let direction: "up-left" | "bottom-left" | "up-right" | "bottom-right" = "bottom-right";

  export let show: boolean = false;
  export let active: boolean = false;
  export let size: Size = undefined;
  export let toggle: (e?: any) => void = toggleHandler;
  export let setActiveFromChild: boolean = false;
  export let menuClass: string = "";

  // state
  let element;
  let { class: className } = $$props;

  $: classes = clsx(className, "dbx-dropdown");
  $: menuClasses = clsx(menuClass, "dropdown-menu", `-${direction}`);

  $: {
    if (typeof document !== "undefined") {
      if (active) {
        ["click", "touchstart", "keyup"].forEach((event) =>
          document.addEventListener(event, documentClickHandler, true)
        );
      } else {
        ["click", "touchstart", "keyup"].forEach((event) =>
          document.removeEventListener(event, documentClickHandler, true)
        );
      }
    }
  }

  $: {
    dropdownStore.update(() => {
      return {
        toggle,
        open,
        direction
      };
    });
  }

  function documentClickHandler(e) {
    if (e && (e.code === "Tab" || (e.type === "keyup" && e.code !== "Enter"))) return;

    if (element.contains(e.target) && element !== e.target && (e.type !== "keyup" || e.code === "Tab")) {
      return;
    }
    toggle(e);
  }

  function menuClickHandler() {
    toggleHandler();
  }

  function toggleHandler() {
    show = !show;
    active = show;
  }
</script>

<div {...$$restProps} class={classes} class:show bind:this={element}>
  <slot {toggle} toggleClass="dbx-dropdown-toggle" />
  <div class={menuClasses} class:show style="margin: 0" on:click={menuClickHandler}>
    <slot name="menu" />
  </div>
</div>

<style lang="scss" global>
  .dbx-dropdown {
    position: relative;
  }
  .dbx-dropdown-toggle {
    position: relative;
    white-space: nowrap;
  }

  .dropdown-menu {
    &.-bottom-right {
      left: auto;
      right: 0;
      top: 0;
      bottom: auto;
    }
  }
</style>
