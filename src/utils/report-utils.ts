import dayjs from "dayjs";
import { convertToNumber } from "./formatter-num";
type Options = {
  isCsv?: boolean;
  params?: Record<string, any>;
  type?: "number" | "rp";
};
export const numericCell = (amount, { isCsv, params = {}, type = "number" }: Options) => {
  return isCsv
    ? amount
      ? type === "rp"
        ? parseFloat(amount).toFixed(2)
        : parseInt(amount)
      : undefined
    : {
        text: amount ? (type === "rp" ? convertToNumber({ value: parseFloat(amount) }) : amount) : "",
        style: "cell-number",
        ...params
      };
};
export const textCell = (text = "", { isCsv, params = {} }) =>
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

export const dateCell = (date, { isCsv, params = {} }) => {
  const dateText = date ? dayjs(date).format("DD-MM-YYYY") : "";
  return isCsv
    ? date
      ? dateText
      : undefined
    : {
        text: dateText,
        style: "cell",
        ...params
      };
};
