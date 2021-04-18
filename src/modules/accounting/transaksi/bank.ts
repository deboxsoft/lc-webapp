import type { BankContext, BankStatementContext } from "@deboxsoft/accounting-client/types/stores";

import { ApplicationContext, getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";
import type { Bank, BankService } from "@deboxsoft/accounting-api";
import type { Readable } from "svelte/store";

let bankService: BankService;

export const createBankContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
) => {
  if (!bankService) {
    bankService = new graphql.BankGraphqlClient({
      fetch,
      subscriptionClient
    });
  }
  return stores.createBankStoreContext({
    bankService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getBankContext = (): BankContext => stores.getBankContext();

export const createBankStatementContext = (
  bank: Readable<Bank>,
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
) => {
  if (!bankService) {
    bankService = new graphql.BankGraphqlClient({
      fetch,
      subscriptionClient
    });
  }
  return stores.createBankStatementContext({
    bank,
    bankService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getBankStatementContext = (): BankStatementContext => stores.getBankStatementContext();
