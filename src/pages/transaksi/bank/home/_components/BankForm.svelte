<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // components
  import Modal from "../../../../../components/Modal.svelte";
  import InputField from "../../../../../components/forms/InputField.svelte";
  import Form from "../../../../../components/forms/Form.svelte";
  import AccountSelect from "../../../../../components/account/AccountSelect.svelte";
  import ComboxField from "../../../../../components/forms/ComboxField.svelte";
  import { filteringAccountCash } from "../../../../../utils";

  const { notify, loading } = getApplicationContext();

  // props
  export let bank;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  export let schema;

  // state
  let openDialog,
    fields,
    isValid = writable(false),
    fieldsErrors,
    submitting = false;

  onMount(() => {
    openDialog();
  });

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "cash": {
        return filteringAccountCash(accountStore);
      }
    }
  }

  const bankList = [
    "Bank Central Asia (BCA)",
    "Bank Mandiri",
    "Bank Rakyat Indonesia (BRI)",
    "Bank Negara Indonesia (BNI)",
    "BCA Syariah",
    "BII Syariah",
    "Bangkok Bank",
    "Bank ANZ Indonesia",
    "Bank Agris",
    "Bank Agroniaga",
    "Bank Andara",
    "Bank Artos Indonesia",
    "Bank BJB (Bandung)",
    "Bank BJB Syariah",
    "Bank BNI Syariah",
    "Bank BNP Paribas Indonesia",
    "Bank BPD Bali (Denpasar)",
    "Bank BPD DIY (Yogyakarta)",
    "Bank BTPN",
    "Bank BRI Syariah",
    "Bank Bengkulu (Bengkulu)",
    "Bank Bisnis Internasional",
    "Bank Bukopin",
    "Bank Bumi Arta",
    "Bank CIMB Niaga",
    "Bank Capital Indonesia",
    "Bank Chinatrust Indonesia",
    "Bank DBS Indonesia",
    "Bank DKI (Jakarta)",
    "Bank Dipo International",
    "Bank Ekonomi Raharja",
    "Bank Fama International",
    "Bank Ganesha",
    "Bank Hana",
    "Bank Harda International",
    "Bank ICBC Indonesia",
    "Bank Ina Perdana",
    "Bank Index Selindo",
    "Bank International Indonesia (BII)",
    "Bank J Trust Indonesia",
    "Bank Jambi (Jambi)",
    "Bank Jasa Jakarta",
    "Bank Jateng (Semarang)",
    "Bank Jatim (Surabaya)",
    "Bank KEB Indonesia",
    "Bank Kalsel (Banjarmasin)",
    "Bank Kalsel Syariah",
    "Bank Kalteng (Palangka Raya)",
    "Bank Kaltim (Samarinda)",
    "Bank Kesejahteraan Ekonomi",
    "Bank Lampung (Bandar Lampung)",
    "Bank Liman International",
    "Bank MNC Internasional",
    "Bank Maluku (Ambon)",
    "Bank Maspion",
    "Bank Mayapada",
    "Bank Maybank Indonesia",
    "Bank Maybank Syariah Indonesia",
    "Bank Mayora",
    "Bank Mestika Dharma",
    "Bank Metro Express",
    "Bank Mitraniaga",
    "Bank Mizuho Indonesia",
    "Bank Muamalat Indonesia",
    "Bank Multi Arta Sentosa",
    "Bank NTB (Mataram)",
    "Bank NTB Syariah",
    "Bank NTT (Kupang)",
    "Bank Nationalnobu",
    "Bank Nusantara Parahayangan",
    "Bank OCBC NISP",
    "Bank Permata",
    "Bank Permata Syariah",
    "Bank Pundi Indonesia",
    "Bank QNB Kesawan",
    "Bank Rabobank International Indonesia",
    "Bank Resona Perdania",
    "Bank Riau Kepri (Pekanbaru)",
    "Bank Riau Kepri Syariah",
    "Bank Royal Indonesia",
    "Bank SBI Indonesia",
    "Bank Sahabat Purba Danarta",
    "Bank Sinar Harapan Bali",
    "Bank Sinarmas",
    "Bank Sulteng (Palu)",
    "Bank Sultra (Kendari)",
    "Bank Sulut (Manado)",
    "Bank Sumitomo Mitsui Indonesia",
    "Bank Sumsel Babel (Palembang)",
    "Bank Sumsel Babel Syariah",
    "Bank Sumut (Medan)",
    "Bank Sumut Syariah",
    "Bank Syariah Bukopin",
    "Bank Syariah Mandiri",
    "Bank Tabungan Pensiunan Nasional",
    "Bank Tabungan Pensiunan Nasional Syariah",
    "Bank UOB Indonesia",
    "Bank Victoria International",
    "Bank Victoria Syariah",
    "Bank Windu Kentjana International",
    "Bank Woori Indonesia",
    "Bank Yudha Bhakti",
    "Bank of America",
    "Bank of China",
    "Bank of India Indonesia",
    "CIMB Niaga Syariah",
    "Centrama Nasional Bank",
    "Citibank",
    "Deutsche Bank",
    "HSBC",
    "HSBC Amanah",
    "JPMorgan Chase",
    "OCBC NISP Syariah",
    "Panin Bank",
    "Panin Bank Syariah",
    "Prima Master Bank",
    "Royal Bank of Scotland",
    "Standard Chartered",
    "The Bank of Tokyo Mitsubishi UFJ"
  ];

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      await onSubmit($fields);
      $goto(to);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        $fieldsErrors = error.flatten().fieldErrors;
        // remap field
        let fieldName;
        if ($fieldsErrors.name) {
          fieldName = "nama";
        } else if ($fieldsErrors.nameAccountBank) {
          fieldName = "nama rekening";
        } else if ($fieldsErrors.noAccountBank) {
          fieldName = "no rekening";
        } else if ($fieldsErrors.accountId) {
          fieldName = "akun rekening";
        }
        notify(`${fieldName} ${error.errors[0].message}`, "error");
      }
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={bank} bind:fields bind:fieldsErrors bind:isValid>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-6">
            <label for="bank">Pilih Bank</label>
            <ComboxField items={bankList} name="name" />
          </div>
          <div class="form-group col-6">
            <label for="branch">Cabang</label>
            <InputField id="branch" name="branch" type="text" class="form-control" placeholder="Cabang" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-6">
            <label for="accountBank">No Rekening</label>
            <InputField
              id="accountBank"
              name="noAccountBank"
              type="text"
              class="form-control"
              placeholder="No Rekening"
            />
          </div>
          <div class="form-group col-6">
            <label for="nameAccountBank">Nama Rekening</label>
            <InputField
              id="nameAccountBank"
              name="nameAccountBank"
              type="text"
              class="form-control"
              placeholder="Nama Rekening"
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="account">Akun Bank</label>
            <AccountSelect id="account" name="accountId" allowEmpty />
          </div>
        </div>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
