import type { SvelteComponentDev } from "svelte/internal";
import InventoryIcon from "__@comps/icons/Inventory.svelte";
import TransactionIcon from "__@comps/icons/Exchange.svelte";
import WarehouseIcon from "__@comps/icons/Warehouse.svelte";
import MoneyCheckAltIcon from "__@comps/icons/MoneyCheckAlt.svelte";
import LayerGroupIcon from "__@comps/icons/LayerGroup.svelte";
import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
// import FileSpreadSheet from "__@comps/icons/FileSpreadsheet.svelte";

export type MenuItem = {
  label?: string;
  url?: string;
  type?: "module" | "spacer" | "divider" | "menu" | "desc";
  children?: MenuItem[];
  icon?: typeof SvelteComponentDev | string;
  show: boolean;
};

export type MenuList = MenuItem[];

export const getMenus = (auth: AuthenticationContext): MenuItem[] => {
  const accountShow = auth.getQuery().read("account").granted;
  const transactionShow = auth.getQuery().read("transaction").granted;
  const ledgerShow = auth.getQuery().read("ledger").granted;
  const bankShow = auth.getQuery().read("bank").granted;
  const balanceSheetShow = auth.getQuery().read("balanceSheet").granted;
  const statementIncomeShow = auth.getQuery().read("statementIncome").granted;
  const inventoryShow = auth.getQuery().read("inventory").granted;
  const bddShow = auth.getQuery().read("bdd").granted;
  const stockShow = auth.getQuery().read("stock").granted;

  return [
    {
      label: "Pencatatan Transaksi",
      url: "/transaksi",
      type: "module",
      icon: TransactionIcon,
      show: accountShow || transactionShow || ledgerShow || bankShow,
      children: [
        {
          label: "Akun Perkiraan",
          url: "/transaksi/akun-perkiraan",
          show: accountShow
        },
        {
          label: "Jurnal",
          url: "/transaksi/jurnal",
          show: transactionShow
        },
        {
          label: "Rekonsiliasi Bank",
          url: "/transaksi/bank",
          show: bankShow
        },
        {
          label: "Buku Besar",
          url: "/transaksi/buku-besar",
          show: ledgerShow
        }
      ]
    },
    {
      label: "Pengikhtisaran",
      url: "/pengikhtisaran",
      type: "module",
      icon: LayerGroupIcon,
      show: balanceSheetShow || statementIncomeShow,
      children: [
        {
          label: "Laporan Laba Rugi",
          url: "/pengikhtisaran/laba-rugi",
          show: statementIncomeShow
        },
        {
          label: "Neraca",
          url: "/pengikhtisaran/neraca",
          show: balanceSheetShow
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
      label: "Inventaris",
      url: "/inventaris",
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
    // {
    //   label: "Pelaporan Keuangan",
    //   url: "/laporan",
    //   type: "module",
    //   icon: FileSpreadSheet,
    //   children: [
    //     // {
    //     //   label: "Dashboard",
    //     //   url: "/dashboard"
    //     // },
    //     {
    //       label: "Financial Report",
    //       url: "/laporan/financial"
    //     }
    //   ]
    // },
    {
      label: "Pengaturan",
      url: "/settings",
      icon: "icon-cog3",
      show: true
    }
  ];
};
