import parser from "papaparse";

/**
 *
 * @param {string} input
 * @param config @url{https://www.papaparse.com/docs#config}
 * @return {any}
 */
export const convertFromCsv = (input: string, config: any) => {
  return parser(input, config).data;
};
