import { convertToRp } from "./converter-num-rp";

export const numericCell = (amount, { isCsv, params = {} }) =>
  isCsv
    ? amount.toString()
    : {
        text: convertToRp(amount),
        style: "cell-rp",
        ...params
      };
export const textCell = (text, { isCsv, params = {} }) =>
  isCsv
    ? text
    : {
        text,
        style: "cell",
        ...params
      };
