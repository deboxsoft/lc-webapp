<script lang="ts">
  import * as z from "@deboxsoft/zod";
  import Form from "__@comps/forms/Form.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getAccessControlContext } from "__@modules/users";
  import AccountListBox from "__@comps/account/AccountListBox.svelte";
  // import InputCheckSwitchery from "../../../components/forms/InputCheckSwitchery.svelte";

  const { grants } = getAccessControlContext();
  $: roles = Object.keys($grants);
  export const schema = z.object({
    name: z.string().nonempty("nama wajib diisi"),
    role: z.string().nonempty("role wajib diisi"),
    mainPage: z.string().nullish(),
    sideMenuHidden: z.boolean().nullish(),
    debitAccounts: z.array(z.string()).nullish(),
    creditAccounts: z.array(z.string()).nullish()
  });
  const transform = ({ debitAccounts, creditAccounts, mainPage, sideMenuHidden, ..._ }) => {
    return {
      ..._,
      metadata: {
        debitAccounts,
        creditAccounts,
        mainPage,
        sideMenuHidden
      }
    };
  };

  const pageList = [
    {
      label: "Dashboard",
      href: "/"
    },
    {
      label: "Akun Transaksi",
      href: "/transaksi/akun-perkiraan"
    },
    {
      label: "Jurnal",
      href: "/transaksi/jurnal"
    },
    {
      label: "Bank",
      href: "/transaksi/bank"
    },
    {
      label: "Buku Besar",
      href: "/transaksi/buku-besar"
    },
    {
      label: "Laporan Laba-Rugi",
      href: "/pengikhtisaran/laba-rugi"
    },
    {
      label: "Laporan Neraca",
      href: "/pengikhtisaran/neraca"
    },
    {
      label: "Inventaris",
      href: "/inventaris"
    },
    {
      label: "BDD",
      href: "/bdd"
    },
    {
      label: "Persediaan",
      href: "/Persediaan"
    },
    {
      label: "Pengaturan",
      href: "/settings"
    }
  ];

  export let fields;
  export let groupUser = {};
  export let isNew = false;
  export let submitHandler;

  $: values = transformValues(groupUser);

  function transformValues({ metadata = "{}", ..._ }) {
    return {
      ..._,
      ...JSON.parse(metadata)
    };
  }
</script>

<div class="card">
  <div class="card-body">
    <Form bind:fields {values} {schema} {transform} bind:submitHandler>
      <div class="row">
        <div class="form-group col-12">
          <label for="name">Nama</label>
          <InputField id="name" name="name" type="text" class="form-control" placeholder="Name" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="role">Role</label>
          <ComboxField id="role" items={roles} name="role" />
        </div>
      </div>

      <div class="row">
        <div class="form-group col-12">
          <AccountListBox name="debitAccounts" id="debitAccounts" label="Custom Akun Debit" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <AccountListBox name="creditAccounts" id="debitAccounts" label="Custom Akun Kredit" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="mainPage">Halaman Utama</label>
          <ComboxField id="mainPage" valueId="href" items={pageList} name="mainPage" />
        </div>
      </div>
<!--      <div class="row">-->
<!--        <div class="form-group col-12">-->
<!--          <InputCheckSwitchery name="sideMenuHidden" label="Sembunyikan Menu Kiri" />-->
<!--        </div>-->
<!--      </div>-->
    </Form>
  </div>
</div>
