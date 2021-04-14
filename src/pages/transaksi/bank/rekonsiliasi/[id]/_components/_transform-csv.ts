import parse from "date-fns/parse";
import isValid from "date-fns/isValid";

export const TEMPLATE_PARSE = {
  STANDARD: "Standard",
  BNI: "BNI",
  MANDIRI: "Bank Mandiri",
  BCA: "BCA",
  BRI: "BRI",
  BRI_SYARIAH: "BRI Syariah",
  BTPN: "BTPN"
};

function sanitizeString(_val: string) {
  // console.log(_val.trim(), _val);
  return _val.trim().replace(/\s+/g, " ");
}

function sanitizeNumber(_val: string) {
  _val = _val.replace(/,/g, "");
  return parseInt(_val);
}

function parseDate(val: string, format: string): Date | false {
  const date = parse(val, format, new Date());
  if (isValid(date)) {
    return date;
  }
  return false;
}

export const bni_transform = (value: string, field: number) => {
  switch (field) {
    // date
    case 0:
      return parse(value, "dd/MM/YYYY HH.mm.ss", new Date());
    // description
    case 1:
      return sanitizeString(value);
    // in
    case 2:
      return;
  }
};

export const bank_standard_transform = (result, self: any) => {
  console.log(result, self);
  // return {
  //   date: row[0],
  //   description: sanitizeString(`${row[1]}`),
  //   in: sanitizeNumber(row[2]),
  //   out: sanitizeNumber(row[3]),
  //   balance: sanitizeNumber(row[4])
  // };
};

export const bank_mandiri_transform = ({ data }) => {
  console.log(data);
  const date = parseDate(data[2], "dd/MM/YYYY");
  return {
    date,
    description: sanitizeString(data[3]),
    in: sanitizeNumber(data[4]),
    out: sanitizeNumber(data[5]),
    balance: sanitizeNumber(data[6])
  };
};
