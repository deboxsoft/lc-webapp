import { getContext, setContext } from "svelte";
import { derived, get, Readable, Writable, writable } from "svelte/store";
import { mappingAccounts, Account, AccountTree, getAccountMap } from "@deboxsoft/accounting-api";

interface BalanceContext {
  keys: string[];
  getStore: (key: string) => Readable<string[]>;
  setValues: (key, values) => void;
  getBalanceAccounts: () => Record<string, Writable<string[]>>;
  getAccountsTree: () => Readable<AccountTree[]>;
  getAccountsMapping: () => Record<
    string,
    {
      accountTrees: AccountTree[];
      ids: string[];
    }
  >;
}

const KEY = {};

export const createBalanceContext = (
  accountStore: Readable<Account[]>,
  balanceAccounts = {
    aktivaLancar: writable<string[]>([]),
    aktivaTetap: writable<string[]>([]),
    pasiva: writable<string[]>([]),
    cadangan: writable<string[]>([]),
    modal: writable<string[]>([])
  }
) => {
  const getAccountsTree = () =>
    derived(accountStore, ($accountStore) => {
      return mappingAccounts($accountStore);
    });
  const accountsTree = getAccountsTree();
  const keys = Object.keys(balanceAccounts);
  setContext<BalanceContext>(KEY, {
    keys,
    getStore: (key) => balanceAccounts[key],
    setValues: (key, values) => balanceAccounts[key].set(values),
    getBalanceAccounts: () => balanceAccounts,
    getAccountsTree: () => accountsTree,
    getAccountsMapping: () => {
      const result: Record<string, any> = {};
      const _accountsTree = get(accountsTree);
      keys.forEach((_key) => {
        result[_key] = getAccountMap(_accountsTree, get(balanceAccounts[_key]));
      });
      return result;
    }
  });
};

export const getBalanceContext = () => getContext<BalanceContext>(KEY);
