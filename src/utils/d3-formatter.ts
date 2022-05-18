import * as d3 from "d3-format";

d3.formatDefaultLocale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["Rp. ", ""]
});

export const formatCurrency = (value: any) => d3.format("($,.2f")(value);
