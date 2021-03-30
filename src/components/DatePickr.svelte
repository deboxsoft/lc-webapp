<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import Flatpickr from "flatpickr";
  import monthSelect from "flatpickr/dist/plugins/monthSelect";
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
  export let confirmEnable: boolean = false;
  export let mode: "month-select" | "menu" | undefined = undefined;
  let input: any = undefined;

  let flatPickr;

  const createFlatPickr = (elem, options: Record<string, any> = {}) => {
    options = {
      altInput: true,
      altFormat: "d-m-Y",
      locale: Indonesian,
      dateFormat: "Z",
      plugins: [],
      ...(element ? { wrap: true } : {}),
      ...options
    };
    if (options.mode === "month-select") {
      options.plugins = [
        ...options.plugins,
        monthSelect({
          shorthand: true,
          dateFormat: defaultOptions.dateFormat
        })
      ];
    }
    if (flatPickr) {
      flatPickr.destroy();
    }
    flatPickr = Flatpickr(elem, {
      ...options,
      ...addHooks(options)
    });
  };

  const createMenuElement = (container: Element) => {
    container.appendChild();
  };

  const menuPlugin = () => {
    return (fp) => {
      if (fp.config.noCalendar || fp.isMobile) {
        return {};
      }
      return {
        onReady() {
          fp._createElement("div");
        }
      };
    };
  };

  onMount(() => {
    const _elem = element || input;
    if (mode === "month-select") {
      flatPickr = createFlatPickr(_elem, { ...options, mode: "mode-select" });
    } else if (mode === "menu") {
      flatPickr = createFlatPickr(_elem, { ...{ mode: "range" }, ...options });
    } else {
      flatPickr = createFlatPickr(_elem, options);
    }
    return () => {
      flatPickr?.destroy();
    };
  });
  const dispatch = createEventDispatcher();
  $: if (flatPickr) {
    for (const [key, val] of Object.entries(addHooks(options))) {
      flatPickr.set(key, val);
    }
  }

  function addHooks(opts: any = {}) {
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
    if (opts.onClose && !opts.onClose.includes(updateValue)) opts.onClose.push(updateValue);
    return opts;
  }

  function updateValue(newValue, dateStr) {
    value = Array.isArray(newValue) && newValue.length === 1 ? newValue[0] : newValue;
    formattedValue = dateStr;
  }

  function stripOn(hook) {
    return hook.charAt(2).toLowerCase() + hook.substring(3);
  }

  function createMenuHandler(menu: string) {
    return () => {
      if (menu === "selector") {
      }
    };
  }
</script>

<style lang="scss" global>
  .dbx-flatpickr {
    display: flex;
    > .menu {
      ul {
        list-style: none;
        margin: 0 auto;
        padding: 0;
        width: 140px;
      }

      li {
        cursor: pointer;
      }
    }
  }

  .flatpickr-monthSelect-months {
    margin: 10px 1px 3px 1px;
    flex-wrap: wrap;
  }

  .flatpickr-monthSelect-month {
    background: none;
    border: 0;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #393939;
    cursor: pointer;
    display: inline-block;
    font-weight: 400;
    margin: 0.5px;
    justify-content: center;
    padding: 10px;
    position: relative;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    text-align: center;
    width: 33%;
  }

  .flatpickr-monthSelect-month.disabled {
    color: #eee;
  }

  .flatpickr-monthSelect-month.disabled:hover,
  .flatpickr-monthSelect-month.disabled:focus {
    cursor: not-allowed;
    background: none !important;
  }

  .flatpickr-monthSelect-theme-dark {
    background: #3f4458;
  }

  .flatpickr-monthSelect-theme-dark .flatpickr-current-month input.cur-year {
    color: #fff;
  }

  .flatpickr-monthSelect-theme-dark .flatpickr-months .flatpickr-prev-month,
  .flatpickr-monthSelect-theme-dark .flatpickr-months .flatpickr-next-month {
    color: #fff;
    fill: #fff;
  }

  .flatpickr-monthSelect-theme-dark .flatpickr-monthSelect-month {
    color: rgba(255, 255, 255, 0.95);
  }

  .flatpickr-monthSelect-month:hover,
  .flatpickr-monthSelect-month:focus {
    background: #e6e6e6;
    cursor: pointer;
    outline: 0;
  }

  .flatpickr-monthSelect-theme-dark .flatpickr-monthSelect-month:hover,
  .flatpickr-monthSelect-theme-dark .flatpickr-monthSelect-month:focus {
    background: #646c8c;
    border-color: #646c8c;
  }

  .flatpickr-monthSelect-month.selected {
    background-color: #569ff7;
    color: #fff;
  }

  .flatpickr-monthSelect-theme-dark .flatpickr-monthSelect-month.selected {
    background: #80cbc4;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: #fff;
    border-color: #80cbc4;
  }
</style>

<input bind:this={input} {...$$restProps} {value} />
<slot />
