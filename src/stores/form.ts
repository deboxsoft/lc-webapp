import type { ZodObject, ZodRawShape } from "@deboxsoft/zod";
import type { Writable } from "svelte/store";

import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export interface Context {
  schema: ZodObject<ZodRawShape>;
  fields: Writable<Record<string, any>>;
  submitted: Writable<boolean>;
  fieldsErrors: Writable<Record<string, string[]>>;
  validateField: (args: any) => (value: unknown) => void;
}

export interface Options {
  schema: ZodObject<ZodRawShape>;
  fields?: Writable<Record<string, any>>;
  values?: any;
  validateField?: (args: any) => (value: unknown) => void;
}

const key = Symbol("form");

export const createFormContext = ({ schema, values, validateField }: Options) => {
  let fields = writable<Record<string, any>>(values);
  let submitted = writable(false);
  let fieldsErrors = writable({});
  let $submitted = false;
  let $fields;
  submitted.subscribe((_submitted) => {
    $submitted = _submitted;
  });
  fields.subscribe((_fields) => {
    $fields = _fields;
  });

  function validateFieldDefault(fieldName: string) {
    return (value: unknown) => {
      if ($submitted) {
        if (schema) {
          const parsed = schema.pick({ [fieldName]: true }).safeParse({ [fieldName]: $fields[fieldName] });
          // @ts-ignore
          const { success, error } = parsed;
          fieldsErrors.update(($fieldsErrors) => {
            $fieldsErrors[fieldName] = !success ? error.errors[0].message : undefined;
            return $fieldsErrors;
          });
        }
      }
    };
  }

  const context: Context = {
    schema,
    fields,
    fieldsErrors,
    submitted,
    validateField: validateField || validateFieldDefault
  };

  setContext<Context>(key, context);
  return context;
};

export const getFormContext = (): Context => getContext(key);
