import type { GeneralLedger, Account, AccountType } from "@deboxsoft/accounting-api";

export type ItemSaldo = {
  name: string;
  amount: number;
};

export type DataSaldo = {
  items: ItemSaldo[];
  sum: number;
};

export interface NeracaDataResult {
  aktivaLancar: DataSaldo;
  aktivaTetap: DataSaldo;
  pasiva: DataSaldo;
  cadangan: DataSaldo;
  modal: DataSaldo;
}

export interface Options {
  accounts: Account[];
  accountsType: AccountType[];
}

const _parsingAccounts = ({ accounts, accountsType }: Options) => {
  let accountTypeMap: { [code: string]: string } = {};
  let accountMap: {
    [accountId: string]: {
      name: string;
      type: number;
    };
  } = {};
  accountsType.forEach((_) => {
    accountTypeMap[_.code] = _.name;
  });
  accounts.forEach((_) => {
    accountMap[_.id] = {
      name: accountTypeMap[_.type],
      type: parseInt(_.type)
    };
  });
  return {
    accountMap,
    accountTypeMap
  };
};

export const neracaParsingUtils = ({ accounts, accountsType }: Options) => {
  const { accountMap } = _parsingAccounts({ accounts, accountsType });
  const result: NeracaDataResult = {
    aktivaTetap: {
      items: [],
      sum: 0
    },
    aktivaLancar: {
      items: [],
      sum: 0
    },
    pasiva: {
      items: [],
      sum: 0
    },
    cadangan: {
      items: [],
      sum: 0
    },
    modal: {
      items: [],
      sum: 0
    }
  };
  return (generalLedgers: GeneralLedger[]): NeracaDataResult => {
    generalLedgers.forEach(({ amount, accountId }) => {
      // convert AccountId
      const { name, type } = accountMap[accountId];
      // aktiva tetap
      if (0 < type && type < 16000) {
        result.aktivaLancar.items.push({ name, amount });
        result.aktivaLancar.sum += amount;
      } else if (16000 <= type && type < 20000) {
        result.aktivaTetap.items.push({ name, amount });
        result.aktivaTetap.sum += amount;
      } else if (20000 <= type && type < 24000) {
        result.pasiva.items.push({ name, amount });
        result.pasiva.sum += amount;
      } else if (24000 <= type && type < 30000) {
        result.cadangan.items.push({ name, amount });
        result.cadangan.sum += amount;
      } else if (30000 <= type && type < 40000) {
        result.modal.items.push({ name, amount });
        result.modal.sum += amount;
      }
    });
    return result;
  };
};

export interface LabaRugiDataResult {
  pendapatan: DataSaldo;
  pendapatanLain: DataSaldo;
  beban: DataSaldo;
  bebanLain: DataSaldo;
}

export const labaRugiParsingUtils = ({ accounts, accountsType }: Options) => {
  const { accountMap } = _parsingAccounts({ accounts, accountsType });
  const result: LabaRugiDataResult = {
    pendapatan: {
      items: [],
      sum: 0
    },
    pendapatanLain: {
      items: [],
      sum: 0
    },
    beban: {
      items: [],
      sum: 0
    },
    bebanLain: {
      items: [],
      sum: 0
    }
  };
  return (generalLedgers: GeneralLedger[]): LabaRugiDataResult => {
    generalLedgers.forEach(({ amount, accountId }) => {
      // convert AccountId
      const { name, type } = accountMap[accountId];
      // aktiva tetap
      if (40000 <= type && type < 41000) {
        result.pendapatan.items.push({ name, amount });
        result.pendapatan.sum += amount;
      } else if (41000 <= type && type < 50000) {
        result.pendapatanLain.items.push({ name, amount });
        result.pendapatanLain.sum += amount;
      } else if (50000 <= type && type < 51000) {
        result.beban.items.push({ name, amount });
        result.beban.sum += amount;
      } else if (51000 <= type && type < 60000) {
        result.bebanLain.items.push({ name, amount });
        result.bebanLain.sum += amount;
      }
    });
    return result;
  };
};
