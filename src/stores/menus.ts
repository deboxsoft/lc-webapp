import type { SvelteComponentDev } from "svelte/internal";
import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import InventoryIcon from "__@comps/icons/Inventory.svelte";
import TransactionIcon from "__@comps/icons/Exchange.svelte";
import WarehouseIcon from "__@comps/icons/Warehouse.svelte";
import MoneyCheckAltIcon from "__@comps/icons/MoneyCheckAlt.svelte";
import LayerGroupIcon from "__@comps/icons/LayerGroup.svelte";
import FileSpreadSheet from "__@comps/icons/FileSpreadsheet.svelte";
import ContractBddMenu from "../pages/bdd/_menus/ContractSidebarMenuItem.svelte";
import { get } from "svelte/store";

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
  const profile = get(auth.authenticationStore);
  const dashboardGranted = auth.getQuery("dashboard").read().granted;
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
  const userShow = auth.getQuery("user").read().granted;
  const settingShow = auth.getQuery("setting").read().granted;
  const settingUpdateGranted = auth.getQuery("setting").update().granted;
  return [
    {
      label: dashboardGranted ? "Dashboard" : "Beranda",
      url: dashboardGranted ? "/dashboard" : "/home",
      type: "menu",
      show: true,
      icon: "icon-home4"
    },
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
      show: stockShow,
      children: [
        {
          label: "Masuk/Keluar Barang",
          url: "/persediaan/approve",
          show: stockShow
        },
        {
          label: "Mutasi barang",
          url: "/persediaan/mutasi-barang",
          show: stockShow
        },
        {
          label: "Daftar Barang",
          url: "/persediaan/home",
          show: stockShow
        },
        {
          label: "Kategori Barang",
          url: "/persediaan/category",
          show: stockShow
        },
        {
          label: "Supplier Barang",
          url: "/persediaan/supplier",
          show: stockShow
        }
      ]
    },
    {
      label: "Aktiva Tetap",
      url: "/aktiva-tetap",
      type: "module",
      icon: InventoryIcon,
      show: inventoryShow,
      children: [
        {
          label: "Pembelian",
          url: "/aktiva-tetap/pembelian",
          show: inventoryShow
        },
        {
          label: "Daftar Aktiva Tetap",
          url: "/aktiva-tetap/home",
          show: inventoryShow
        },
        {
          label: "Daftar Kategori",
          url: "/aktiva-tetap/kategori",
          show: inventoryShow
        }
      ]
    },
    {
      label: "BDD",
      url: "/bdd",
      type: "module",
      icon: MoneyCheckAltIcon,
      show: bddShow,
      children: [
        {
          label: "Daftar BDD",
          url: "/bdd/home",
          show: bddShow
        },
        {
          label: "Sisa Kontrak",
          url: "/bdd/warning",
          show: bddShow,
          component: ContractBddMenu
        }
      ]
    },
    {
      label: "Laporan",
      url: "/laporan",
      type: "module",
      icon: LayerGroupIcon,
      show: balanceSheetShow || statementIncomeShow || ledgerShow,
      children: [
        {
          label: "Saldo Perkiraan",
          url: "/laporan/saldo-perkiraan",
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
      label: "Manajemen Pengguna",
      url: "/users",
      icon: "icon-user",
      type: "module",
      show: userShow,
      children: [
        {
          label: "Data Pengguna",
          url: "/users/home",
          show: userShow
        },
        {
          label: "Grup Pengguna",
          url: "/users/group",
          show: userShow
        },
        {
          label: "Akses Pengguna",
          url: "/users/role",
          show: userShow
        }
      ]
    },
    {
      label: "Pengaturan Aplikasi",
      url: "/settings",
      type: "module",
      icon: "icon-cog3",
      show: settingShow || settingUpdateGranted,
      children: [
        {
          label: "Info Perusahaan",
          url: "/settings/info",
          show: settingShow
        }
        // {
        //   label: "Proses Akhir Tahun",
        //   url: "/settings/period-end",
        //   show: settingUpdateGranted
        // }
        // {
        //   label: "Akuntansi",
        //   url: "/settings/accounting",
        //   show: settingShow
        // }
      ]
    },
    {
      label: "Pengaturan Profil",
      url: "/profile",
      type: "module",
      icon: "icon-profile",
      show: profile.authenticated,
      children: [
        {
          label: "Info Profil",
          url: "/profile/info",
          show: profile.authenticated
        },
        {
          label: "Ganti Password",
          url: "/profile/password",
          show: profile.authenticated
        }
      ]
    }
  ];
};
