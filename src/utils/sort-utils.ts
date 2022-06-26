/**
 *
 * function sort array native
 * ex : [].sort(sortUtilsFunc)
 */

import { dayjs } from "@deboxsoft/accounting-api";

export const sortUtilsFunc = (key, order: "asc" | "desc" = "asc") => {
  return (a, b) => {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
      // property doesn't exist on either object
      return 0;
    }

    let comparison = 0;
    if (a[key] instanceof Date) {
      comparison = dayjs(a[key]).isAfter(b[key]) ? 1 : -1;
    } else {
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};
