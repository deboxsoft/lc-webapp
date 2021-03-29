import type { SvelteComponentDev } from "svelte/internal";
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
  icon?: typeof SvelteComponentDev;
};

export type MenuList = MenuItem[];
export const leftMenus: MenuList = [
  {
    label: "Pencatatan Transaksi",
    url: "/transaksi",
    type: "module",
    icon: TransactionIcon,
    children: [
      {
        label: "Akun Perkiraan",
        url: "/transaksi/akun-perkiraan"
      },
      {
        label: "Jurnal",
        url: "/transaksi/jurnal"
      },
      {
        label: "Rekonsiliasi Bank",
        url: "/transaksi/rekonsiliasi-bank"
      },
      {
        label: "Buku Besar",
        url: "/transaksi/buku-besar"
      }
    ]
  },
  {
    label: "Persediaan [add-on]",
    url: "/persediaan",
    type: "module",
    icon: WarehouseIcon,
    children: [
      {
        label: "Stock In",
        url: "/persediaan/stock-in"
      },
      {
        label: "Stock Out",
        url: "/persediaan/stock-out"
      }
    ]
  },
  {
    label: "Inventaris [add-on]",
    url: "/inventaris",
    type: "module",
    icon: InventoryIcon,
    children: [
      {
        label: "Pencatatan Inventaris",
        url: "/inventaris/pencatatan"
      },
      {
        label: "Penyusutan aset",
        url: "/inventaris/penyusutan"
      }
    ]
  },
  {
    label: "Amortisasi [add-on]",
    url: "/amortisasi",
    type: "module",
    icon: MoneyCheckAltIcon,
    children: [
      {
        label: "BDD Transaksi",
        url: "/amortisasi/bdd"
      },
      {
        label: "Akumulasi Amortisasi",
        url: "/amortisasi/akumulasi"
      }
    ]
  },
  {
    label: "Pengikhtisaran",
    url: "/pengikhtisaran",
    type: "module",
    icon: LayerGroupIcon,
    children: [
      {
        label: "Laporan Laba Rugi",
        url: "/pengikhtisaran/laba-rugi"
      },
      {
        label: "Neraca",
        url: "/pengikhtisaran/neraca"
      },
      {
        label: "Aktiva Tetap",
        url: "/pengikhtisaran/aktiva-tetap"
      }
    ]
  },
  {
    label: "Pelaporan Keuangan",
    url: "/laporan",
    type: "module",
    icon: FileSpreadSheet,
    children: [
      // {
      //   label: "Dashboard",
      //   url: "/dashboard"
      // },
      {
        label: "Financial Report",
        url: "/laporan/financial"
      }
    ]
  }
];