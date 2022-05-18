import { derived, writable } from "svelte/store";
import { accountLocale } from "./account";

export type TranslateOptions = {
  locale?: string;
  key: string;
  vars?: Record<string, string>;
};

const defaultLocale = "id";
const translations = {
  id: {
    ...accountLocale.id
  }
};

export const locale = writable(defaultLocale);

function translate({ locale = defaultLocale, vars = {}, key }: TranslateOptions) {
  if (!Object.keys(translations).includes(locale)) {
    key = defaultLocale;
  }
  let text = translations[locale][key] || translations[defaultLocale][key];
  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });
  return text;
}

export const t = derived(
  locale,
  ($locale) =>
    (key, vars = {}) =>
      translate({
        locale: $locale,
        key,
        vars
      })
);
