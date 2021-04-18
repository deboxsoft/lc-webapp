<script lang="ts">
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";
  import { clsx, getId } from "@deboxsoft/svelte-theme-limitless/utils";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher: any = createEventDispatcher();
  export let id: string = getId();
  export let name: string;
  export let label: string = "";
  export let disabled: boolean = false;
  export let checked: boolean = ($fields && $fields[name]) || false;

  let { class: className } = $$props;
  let classes: string | undefined;
  let invalid = true;
  let msgError: string[] | undefined;

  $: {
    if ($fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  $: classes = clsx(className, "form-check-input-styled");

  function createToggleHandler() {
    const _validate = validateField(name);
    return (e: any) => {
      if (!disabled) {
        checked = !checked;
        $fields && ($fields[name] = checked)
        _validate();
        dispatcher("change", checked)
      }
    }

  }
</script>

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

<div class="form-check form-check-switchery" class:checked class:disabled>
  <label class="form-check-label" for={id} on:click={createToggleHandler()}>
    <input
      type="checkbox"
      class="form-check-input-switchery-primary"
      {checked}
      data-fouc
      data-switchery={checked}
      {disabled}
      {...$$restProps}
      style="display: none" />
    <span class="switchery switchery-default"> <small class="slider" /></span>
    <slot>{label}</slot>
  </label>
</div>
