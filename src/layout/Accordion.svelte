<script>
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import { clsx } from "@deboxsoft/module-client";

  // props
  export let multiSelect = false;

  // state
  let { class: className } = $$props;
  let classes;

  // handler
  const items = writable({});
  setContext("Accordion", {
    items,
    add: (item) => {
      items.update((_) => ({ ..._, [item.id]: item.expanded }));
    },
    remove: (item) => {
      items.update((_) => {
        delete _[item.id];
        return _;
      });
    },
    toggle: (item) => {
      items.update((_) => {
        if (!multiSelect) {
          Object.keys(_).forEach((id) => (_[id] = false));
        }
        return { ..._, [item.id]: item.expanded };
      });
    }
  });

  $: classes = clsx(className, "nav");
</script>

<ul {...$$restProps} class={classes} data-nav-type="accordion">
  <slot />
</ul>
