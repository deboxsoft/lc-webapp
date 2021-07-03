import dayjs from "dayjs";

export function sanitizeString(_val: string = "") {
  return _val.trim().replace(/\s+/g, " ");
}

export function sanitizeNumber(stringValue: string = "") {
  stringValue = stringValue.trim();
  let result = stringValue.replace(/[^0-9]/g, "");
  if (/[,\\.]\d{2}$/.test(stringValue)) {
    result = result.replace(/(\d{2})$/, ".$1");
  }
  return parseFloat(result);
}

export function sanitizeAccount(_val: string) {
  // hapus titik pada kode akun
  return _val && _val.replace(/\./g, "");
}

export function parseDate(val: string) {
  // DD/MM/YYYY
  if (/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/.test(val)) {
    // fix to MM/DD/YYYY
    const _split = val.split("/");
    return dayjs(`${_split[1]}/${_split[0]}/${_split[2]}`, "DD/MM/YYYY").toDate();
  }
  return false;
}
