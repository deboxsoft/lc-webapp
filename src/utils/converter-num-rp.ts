export const convertToRp = (value: number, thousandSeparator: string = ".", decimalSeparator: string = ",") => {
  return value
    .toFixed(2)
    .replace(".", decimalSeparator)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};
