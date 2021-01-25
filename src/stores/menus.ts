import type { SvelteComponent } from "svelte/internal";

export type MenuItem = {
  label?: string;
  url?: string;
  type?: "module" | "spacer" | "divider" | "menu" | "desc";
  children?: MenuItem[];
  icon?: typeof SvelteComponent;
};

export type MenuList = MenuItem[];
export const leftMenus: MenuList = [
  {
    label: "Pencatatan Transaksi",
    url: "/transaksi",
    type: "module",
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
    label: "Dashboard Pelaporan Keuangan",
    url: "/dashboard",
    type: "module",
    children: [
      {
        label: "Dashboard",
        url: "/dashboard"
      },
      {
        label: "Financial Report",
        url: "/dashboard/financial"
      }
    ]
  }
];
