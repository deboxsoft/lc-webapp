import type { BankContext, BankStatementContext } from "@deboxsoft/accounting-client/types/stores";
import type { Bank } from "@deboxsoft/accounting-api";
import type { BankServiceClient } from "@deboxsoft/accounting-client/types/types";
import type { Readable } from "svelte/store";

import { ApplicationContext, getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

let bankService: BankServiceClient;

export const createBankContext = (appContext: ApplicationContext = getApplicationContext()) => {
  if (!bankService) {
    bankService = new graphql.BankGraphqlClient(appContext);
  }
  return stores.createBankStoreContext({
    bankService
  });
};

export const getBankContext = (): BankContext => stores.getBankContext();

export const createBankStatementContext = (
  bank: Readable<Bank>,
  appContext: ApplicationContext = getApplicationContext()
) => {
  if (!bankService) {
    bankService = new graphql.BankGraphqlClient(appContext);
  }
  return stores.createBankStatementContext({
    bank,
    bankService
  });
};

export const getBankStatementContext = (): BankStatementContext => stores.getBankStatementContext();
