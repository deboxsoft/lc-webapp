import type { SvelteComponentDev } from "svelte/internal";
import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import InventoryIcon from "__@comps/icons/Inventory.svelte";
import TransactionIcon from "__@comps/icons/Exchange.svelte";
import WarehouseIcon from "__@comps/icons/Warehouse.svelte";
import MoneyCheckAltIcon from "__@comps/icons/MoneyCheckAlt.svelte";
import LayerGroupIcon from "__@comps/icons/LayerGroup.svelte";
import FileSpreadSheet from "__@comps/icons/FileSpreadsheet.svelte";

export type MenuItem = {
  label?: string;
  url?: string;
  type?: "module" | "spacer" | "divider" | "menu" | "desc";
  children?: MenuItem[];
  icon?: typeof SvelteComponentDev | string;
  show: boolean;
  component?: typeof SvelteComponentDev;
};

export type MenuList = MenuItem[];

export const getMenus = (auth: AuthenticationContext): MenuItem[] => {
  const accountShow = auth.getQuery("account").read().granted;
  const programShow = auth.getQuery("program").read().granted;
  const transactionShow = auth.getQuery("transaction").read().granted;
  const transactionOwnShow = auth.getQuery("transaction").readOwn().granted;
  const ledgerShow = auth.getQuery("ledger").read().granted;
  const bankShow = auth.getQuery("bank").read().granted;
  const cashierShow = auth.getQuery("cashier").read().granted;
  const balanceSheetShow = auth.getQuery("balanceSheet").read().granted;
  const statementIncomeShow = auth.getQuery("statementIncome").read().granted;
  const inventoryShow = auth.getQuery("inventory").read().granted;
  const bddShow = auth.getQuery("bdd").read().granted;
  const stockShow = auth.getQuery("stock").read().granted;

  return [
    {
      label: "Pencatatan Transaksi",
      url: "/transaksi",
      type: "module",
      icon: TransactionIcon,
      show: transactionShow || transactionOwnShow || bankShow,
      children: [
        {
          label: "Jurnal",
          url: "/transaksi/jurnal",
          show: transactionShow || transactionOwnShow
        },
        {
          label: "Rekonsiliasi Bank",
          url: "/transaksi/bank",
          show: bankShow
        },
        {
          label: "Kasir",
          url: "/transaksi/kasir",
          show: cashierShow
        }
      ]
    },
    {
      label: "Persediaan",
      url: "/persediaan",
      type: "module",
      icon: WarehouseIcon,
      show: stockShow
    },
    {
      label: "Aktiva Tetap",
      url: "/aktiva-tetap",
      icon: InventoryIcon,
      show: inventoryShow
    },
    {
      label: "BDD",
      url: "/bdd",
      type: "module",
      icon: MoneyCheckAltIcon,
      show: bddShow
    },
    {
      label: "Laporan",
      url: "/laporan",
      type: "module",
      icon: LayerGroupIcon,
      show: balanceSheetShow || statementIncomeShow || ledgerShow,
      children: [
        {
          label: "Trial Balance",
          url: "/laporan/trial-balance",
          show: ledgerShow
        },
        {
          label: "Laba Rugi Perkiraan",
          url: "/laporan/laba-rugi-perkiraan",
          show: statementIncomeShow
        },
        {
          label: "Neraca Perkiraan",
          url: "/laporan/neraca-perkiraan",
          show: balanceSheetShow
        },
        {
          label: "Buku Besar",
          url: "/laporan/buku-besar",
          show: ledgerShow
        },
        {
          label: "Laba Rugi",
          url: "/laporan/laba-rugi",
          show: statementIncomeShow
        },
        {
          label: "Neraca",
          url: "/laporan/neraca",
          show: balanceSheetShow
        }
      ]
    },
    {
      label: "Master Data",
      type: "module",
      icon: FileSpreadSheet,
      show: accountShow,
      url: "/master",
      children: [
        {
          label: "Akun Perkiraan",
          url: "/master/akun-perkiraan",
          show: accountShow
        },
        {
          label: "Program",
          url: "/master/program",
          show: programShow
        }
      ]
    },
    {
      label: "Pengaturan",
      url: "/settings",
      icon: "icon-cog3",
      show: true
    }
  ];
};
