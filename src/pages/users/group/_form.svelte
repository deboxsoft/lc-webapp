<script>
  import { z } from "@deboxsoft/zod";
  import { stores } from "@deboxsoft/accounting-client";
  import AccountSelect from "../../../components/account/AccountSelect.svelte";
  import Form from "../../../components/forms/Form.svelte";
  import ComboxField from "../../../components/forms/ComboxField.svelte";
  import InputField from "../../../components/forms/InputField.svelte";
  import { getAccessControlContext } from "__@modules/users";
  import AccountListBox from "../../../components/account/AccountListBox.svelte";
  import InputCheckSwitchery from "../../../components/forms/InputCheckSwitchery.svelte";
  import { getApplicationContext } from "../../../modules/app";

  const { grants } = getAccessControlContext();
  const { notify, loading } = getApplicationContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const accountStore = getAccountLeaf();

  $: roles = Object.keys($grants);
  const schemaForm = z.object({
    name: z.string().min(1, "nama wajib diisi"),
    role: z.string().min(1, "role wajib diisi"),
    mainPage: z.string().nullish(),
    sideMenuHidden: z.boolean().nullish(),
    isCashier: z.boolean().nullish(),
    includeAccounts: z.array(z.string()).nullish()
  });
  export const schema = schemaForm.transform(({ isCashier, includeAccounts, mainPage, sideMenuHidden, ..._ }) => {
    return {
      ..._,
      metadata: {
        isCashier,
        includeAccounts,
        mainPage,
        sideMenuHidden
      }
    };
  });

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

  export let groupUser = {};
  export let isUpdate = false;
  export let isValid;
  export let submitting;
  export let onSubmit;
  export let fields;
  export let submit = (_onSubmit) => submitHandler(_onSubmit);

  let fieldsErrors;
  $: values = transformValues(groupUser);

  async function submitHandler(_onSubmit = onSubmit) {
    try {
      $loading = true;
      submitting = true;
      if (_onSubmit) {
        await _onSubmit(values);
      }
    } catch (e) {
      console.error(e);
      notify(`${e.path[0]} ${e.message}`, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function transformValues({ metadata = {}, ..._ }) {
    return {
      ..._,
      ...metadata
    };
  }

  function keyHandler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  }
</script>

<div class="card">
  <div class="card-body">
    <Form checkValidateFirst bind:fields {values} schema={schemaForm} bind:fieldsErrors bind:isValid>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="name">Nama</label>
          <InputField
            id="name"
            name="name"
            type="text"
            class="form-control"
            placeholder="Name"
            on:keypress={keyHandler}
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="role">Role</label>
          <ComboxField id="role" items={roles} name="role" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <InputCheckSwitchery id="isCashier" name="isCashier">Sebagai Kasir</InputCheckSwitchery>
        </div>
      </div>
      {#if $fields?.isCashier}
        <div class="row">
          <div class="form-group col-12">
            <label for="parentId">Kasir Akun</label>
            <AccountSelect
              id="cashierAccount"
              name="cashierAccount"
              {accountStore}
              allowEmpty
              on:keypress={keyHandler}
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <AccountListBox name="includeAccounts" id="includeAccounts" label="Custom Akun" />
          </div>
        </div>
      {/if}
      <div class="row">
        <div class="form-group col-12">
          <label for="mainPage">Halaman Utama</label>
          <ComboxField id="mainPage" valueId="href" items={pageList} name="mainPage" />
        </div>
      </div>
    </Form>
  </div>
</div>
