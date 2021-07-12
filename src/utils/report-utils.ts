import { convertToRp } from "./converter-num-rp";

export const numericCell = (amount, { isCsv, params = {} }) => {
  return isCsv
    ? amount
      ? parseFloat(amount).toFixed(2)
      : undefined
    : {
        text: convertToRp(amount),
        style: "cell-rp",
        ...params
      };
};
export const textCell = (text, { isCsv, params = {} }) =>
  isCsv
    ? text
    : {
        text,
        style: "cell",
        ...params
      };
export const emptyCell = ({ isCsv, params = {} }) =>
  isCsv
    ? undefined
    : {
        text: "",
        style: "cell",
        ...params
      };
