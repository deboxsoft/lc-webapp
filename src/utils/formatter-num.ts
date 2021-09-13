type Options = {
  value: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
  fractionDigits?: number;
};
export const convertToNumber = ({
  value,
  thousandSeparator = ".",
  decimalSeparator = ",",
  fractionDigits = 2
}: Options) => {
  const _value = (Math.round(value * 100) / 100).toFixed(fractionDigits);
  return `${_value.replace(".", decimalSeparator).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
};
