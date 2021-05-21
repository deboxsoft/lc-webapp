import { ZodIssueCode, ZodErrorMap, setErrorMap } from "@deboxsoft/zod";

const errorMap: ZodErrorMap = (error, _ctx) => {
  let message: string;
  switch (error.code) {
    case ZodIssueCode.invalid_type:
      if (error.received === "undefined") {
        message = "Harus diisi";
      } else {
        message = `Seharusnya ${error.expected}, tapi diperoleh ${error.received}`;
      }
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Tidak dikenal key di dalam object: ${error.keys.map((k) => `'${k}'`).join(", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Kesalahan input`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Kesalahan enum value. Seharusnya tipe ${error.options
        .map((val) => (typeof val === "string" ? `'${val}'` : val))
        .join(" | ")}, tetapi diperoleh tipe ${typeof _ctx.data === "string" ? `'${_ctx.data}'` : _ctx.data}`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Kesalahan fungsi arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Kesalahan tipe pengembalian fungsi`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Kesalahan tanggal`;
      break;
    case ZodIssueCode.invalid_string:
      if (error.validation !== "regex") message = `Kesalahan ${error.validation}`;
      else message = "Kesalahan";
      break;
    case ZodIssueCode.too_small:
      if (error.type === "array")
        message = `${error.inclusive ? `paling sedikit` : `lebih dari`} ${error.minimum} items`;
      else if (error.type === "string")
        message = `${error.inclusive ? `paling sedikit` : `di atas`} ${error.minimum} karakter`;
      else if (error.type === "number")
        message = `Nilai lebih besar dari ${error.inclusive ? `atau sama dengan ` : ``}${error.minimum}`;
      else message = "Kesalahan input";
      break;
    case ZodIssueCode.too_big:
      if (error.type === "array")
        message = `Seharusnya mempunyai ${error.inclusive ? `paling banyak` : `kurang dari`} ${error.maximum} items`;
      else if (error.type === "string")
        message = `Seharusnya ${error.inclusive ? `paling banyak` : `dibawah`} ${error.maximum} panjang karakter`;
      else if (error.type === "number")
        message = `Nilai harus kurang dari ${error.inclusive ? `atau sama dengan ` : ``}${error.maximum}`;
      else message = "Kesalahan input";
      break;
    case ZodIssueCode.custom:
      message = `Kesalahan input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection hanya untuk obyek`;
      break;
  }
  return { message };
};

setErrorMap(errorMap);
