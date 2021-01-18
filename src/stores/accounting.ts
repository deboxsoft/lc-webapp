import type { Account, CreateAccountInput, UpdateAccountInput } from "@deboxsoft/accounting-api";
import type { Writable } from "svelte/store";

import { createAccountingManager } from "@deboxsoft/accounting-client";
import { derived, writable } from "svelte/store";

let accountStore: Writable<Account[]>;

export const accountManager = createAccountingManager({});

export const getListAccountType = accountManager.listAccountType();

export const fetchAccountList = async (filter?: any) => {
  try {
    return await accountManager.getAccountList(filter);
  } catch (e) {
    throw new Error(e);
  }
};

export const getAccountStore = async () => {
  if (!accountStore) {
    const accounts = await fetchAccountList();
    accountStore = writable(accounts);
  }
  return accountStore;
};

export const getAccount = async (id: string) => {
  try {
    if (accountStore) {
      await getAccountStore();
    }
    return derived(accountStore, ($accountStore) => $accountStore.find((account) => account.id === id));
  } catch (e) {
    throw new Error(e);
  }
};

export const createAccount = async (input: CreateAccountInput) => {
  try {
    const result = await accountManager.createAccount(input);
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateAccount = async (id: string, input: UpdateAccountInput) => {
  try {
    const result = await accountManager.updateAccount(id, input);
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const removeAccount = async (id: string) => {
  try {
    const result = await accountManager.removeAccount(id);
    return result;
  } catch (e) {
    throw new Error(e);
  }
};
