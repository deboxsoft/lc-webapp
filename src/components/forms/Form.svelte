<script lang="ts">
  import type { ZodObject, ZodRawShape } from "@deboxsoft/zod";

  import { ZodError } from "@deboxsoft/zod";
  import { createEventDispatcher } from "svelte";
  import { createFormContext } from "__@stores/form";
  import { getApplicationContext } from "__@modules/app";

  const dispatch = createEventDispatcher();
  const {notify} = getApplicationContext()

  export let schema: ZodObject<ZodRawShape> | undefined = undefined;
  export let values: Record<string, any> = {};

  const { submitted, fieldsErrors, fields } = createFormContext({ schema, values });

  function submitHandler() {
    try {
      $submitted = true;
      const values = schema.parse($fields);
      dispatch("submit", values);
    } catch (e) {
      if (e instanceof ZodError) {
        $fieldsErrors = e.flatten().fieldErrors;
        console.error(e.issues);
        notify(e.errors[0].message, "error");
      }
    }
  }
</script>

<form on:submit|preventDefault={submitHandler} {...$$restProps}>
  <slot />
</form>
