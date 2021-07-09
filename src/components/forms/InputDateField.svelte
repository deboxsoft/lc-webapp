<script>
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getFormContext } from "__@stores/form";
  import DatePicker from "@deboxsoft/svelte-datepicker/src/components/DatePicker.svelte";
  import { CalendarStyle } from "@deboxsoft/svelte-datepicker/src/calendar-style";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let disabled = false;
  export let formattedValue = "";
  export let options = {};
  export let startDateKey = "startDate";
  export let endDateKey = "endDate";
  export let name = undefined;
  export let allowEmpty = false;
  export let selected = $fields
    ? name
      ? $fields[name]
      : $fields[startDateKey]
      ? [$fields[startDateKey], $fields[endDateKey]]
      : undefined
    : undefined;
  export let range = !(selected instanceof Date);
  /**
   * @type {"month-select" | "menu" | undefined}
   */
  export let mode = undefined;
  export let input = undefined;
  const { class: className } = $$props;

  let classes = "";
  let invalid = true;
  let msgError;

  function applyHandler({ detail }) {
    if ($fields) {
      if (name) {
        $fields[name] = [detail.from, detail.to];
      } else {
        $fields[startDateKey] = detail.from;
        $fields[endDateKey] = detail.to;
      }
    }
    dispatcher("apply", detail);
  }

  $: classes = clsx(className);

  $: {
    if ($fieldsErrors && $fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }
</script>

<DatePicker
  class="form-control"
  {range}
  {allowEmpty}
  placeholder="Tanggal"
  applyLabel="Pilih"
  closeLabel="Tutup"
  bind:selected
  styling={new CalendarStyle({ buttonWidth: "100%", datepickerWidth: "100%" })}
  wrapperInputClass="form-group form-group-feedback form-group-feedback-right"
  showClearButton
  on:range-selected={applyHandler}
  end
>
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</DatePicker>
