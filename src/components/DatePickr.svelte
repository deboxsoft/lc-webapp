<script lang="ts">
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import { onMount, createEventDispatcher } from "svelte";
  import Flatpickr from "flatpickr";
  import { Indonesian } from "flatpickr/dist/esm/l10n/id";

  const hooks = new Set([
    "onChange",
    "onOpen",
    "onClose",
    "onMonthChange",
    "onYearChange",
    "onReady",
    "onValueUpdate",
    "onDayCreate"
  ]);
  export let value: any = new Date();
  export let formattedValue: string = "";
  export let element: HTMLElement | null = null;
  export let options = {};
  export let input: any = undefined;

  let defaultOptions = { altInput: true, altFormat: "d-M-Y", locale: Indonesian, dateFormat: "Z" }
  let flatPickr;
  onMount(() => {
    const elem = element || input;
    flatPickr = Flatpickr(
      elem,
      {
        ...defaultOptions,
        ...addHooks(options),
        ...(element ? { wrap: true } : {})
      }
    );
    return () => {
      flatPickr.destroy();
    };
  });
  const dispatch = createEventDispatcher();
  $: if (flatPickr) {
    for (const [key, val] of Object.entries(addHooks(options))) {
      flatPickr.set(key, val);
    }
  }

  function addHooks(opts = {}) {
    opts = Object.assign({}, opts);
    for (const hook of hooks) {
      const firer = (selectedDates, dateStr, instance) => {
        dispatch(stripOn(hook), [selectedDates, dateStr, instance]);
      };
      if (hook in opts) {
        // Hooks must be arrays
        if (!Array.isArray(opts[hook])) opts[hook] = [opts[hook]];
        opts[hook].push(firer);
      } else {
        opts[hook] = [firer];
      }
    }
    if (opts.onChange && !opts.onChange.includes(updateValue)) opts.onChange.push(updateValue);
    return opts;
  }

  function updateValue(newValue, dateStr) {
    value = Array.isArray(newValue) && newValue.length === 1 ? newValue[0] : newValue;
    formattedValue = dateStr;
  }

  function stripOn(hook) {
    return hook.charAt(2).toLowerCase() + hook.substring(3);
  }
</script>

<slot>
  <InputField {value} bind:ref={input} {...$$restProps} />
</slot>
