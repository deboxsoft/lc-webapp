import { sanitizeNumber, sanitizeAccount, sanitizeString, parseDate } from "__@root/utils";

export const createTransformBank = (output: any[]) => {
  return (result, self: any) => {
    const date = parseDate(result.data[0]);
    if (date) {
      output.push({
        date,
        description: sanitizeString(`${result.data[1]}`),
        in: sanitizeNumber(result.data[2]),
        out: sanitizeNumber(result.data[3]),
        balance: sanitizeNumber(result.data[4]),
        accountId: sanitizeAccount(result.data[5])
      });
    }
  };
};
