export const convertToRp = (value: number, thousandSeparator: string = ".", decimalSeparator: string = ",") => {
  const _value = (Math.round(value * 100) / 100).toFixed(2);
  return `${_value.replace(".", decimalSeparator).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
};
