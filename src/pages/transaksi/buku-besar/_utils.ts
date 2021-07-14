import type { Account } from "@deboxsoft/accounting-api";

export const calculateBalance = (accounts: Account[]) => {
  for (const account of accounts) {
    if (account.children) {
      account.balance = 0;
      account.balanceFixed = 0;
      for (const child of account.children) {
        account.balance += child.balance || 0;
        account.balanceFixed += child.balanceFixed || 0;
      }
    }
  }
};
