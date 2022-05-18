<script>
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";
  import { generateId } from "@deboxsoft/module-client";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();
  export let id = generateId();
  export let name;
  export let label = "";
  export let disabled = false;
  export let checked = ($fields && $fields[name]) || false;
  export let labelClass = "";

  let { class: className } = $$props;
  let classes;
  let invalid = true;
  let msgError;

  $: {
    if ($fieldsErrors && $fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  function createToggleHandler() {
    const _validate = validateField && validateField(name);
    return (e) => {
      if (!disabled) {
        checked = !checked;
        $fields && ($fields[name] = checked);
        _validate && _validate();
        dispatcher("change", checked);
      }
    };
  }
</script>

<div class="form-check form-check-switchery {className}" class:checked class:disabled>
  <label class="form-check-label" for={id} on:click={createToggleHandler()}>
    <input
      type="checkbox"
      autocomplete="off"
      class="form-check-input-switchery-primary"
      {checked}
      data-fouc
      data-switchery={checked}
      {disabled}
      {...$$restProps}
      style="display: none"
    />
    <span class="switchery switchery-default"> <small class="slider" /></span>
    <slot>{label}</slot>
  </label>
</div>

<style lang="scss" global>
  .form-check-switchery {
    &.checked {
      .switchery {
        background-color: rgb(33, 150, 243);
        border-color: rgb(33, 150, 243);
        box-shadow: rgb(33, 150, 243) 0 0 0 10px inset;
        transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s, background-color 1.2s ease 0s;
      }

      .slider {
        left: 18px;
      }
    }
    .switchery {
      background-color: rgb(255, 255, 255);
      border-color: rgb(223, 223, 223);
      box-shadow: rgb(223, 223, 223) 0 0 0 0 inset;
      transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s;
    }
    .slider {
      left: 0;
      transition: background-color 0.4s ease 0s, left 0.2s ease 0s;
      background-color: rgb(255, 255, 255);
    }
  }
</style>
