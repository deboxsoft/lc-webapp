import dayjs from "dayjs";

export const TEMPLATE_PARSE = {
  STANDARD: "Standard",
  BNI: "BNI",
  MANDIRI: "Bank Mandiri",
  BCA: "BCA",
  BRI: "BRI",
  BRI_SYARIAH: "BRI Syariah",
  BTPN: "BTPN"
};

function sanitizeString(_val: string = "") {
  // console.log(_val.trim(), _val);
  return _val.trim().replace(/\s+/g, " ");
}

function sanitizeNumber(stringValue: string = "") {
  stringValue = stringValue.trim();
  let result = stringValue.replace(/[^0-9]/g, "");
  if (/[,\\.]\d{2}$/.test(stringValue)) {
    result = result.replace(/(\d{2})$/, ".$1");
  }
  return parseFloat(result);
}

function sanitizeAccount(_val: string) {
  return _val && _val.replace(/\./g, "");
}

function parseDate(val: string, format: string): Date | false {
  const date = dayjs(val, format).toDate();
  if (dayjs(date).isValid()) {
    return date;
  }
  return false;
}

export const bni_transform = (value: string, field: number) => {
  switch (field) {
    // date
    case 0:
      return dayjs(value, "DD/MM/YYYY HH.mm.ss").toDate();
    // description
    case 1:
      return sanitizeString(value);
    // in
    case 2:
      return;
  }
};

export const createTransformBank = (output: any[]) => {
  return (result, self: any) => {
    if (parseDate(result.data[0], "DD/MM/YYYY")) {
      output.push({
        date: result.data[0],
        description: sanitizeString(`${result.data[1]}`),
        in: sanitizeNumber(result.data[2]),
        out: sanitizeNumber(result.data[3]),
        balance: sanitizeNumber(result.data[4]),
        accountId: sanitizeAccount(result.data[5])
      });
    }
    // return {
    // };
  };
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
