<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { BankInputSchema } from "@deboxsoft/accounting-api";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { getBankContext } from "__@modules/accounting";

  // components
  import Modal from "__@comps/Modal.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { notify } = getApplicationContext();
  const { bankStore } = getBankContext();
  const dispatch = createEventDispatcher();

  // props
  export let bank;
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";
  let fields;
  let loading = false;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);
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

  async function submitHandler(e) {
    loading = true;
    try {
      BankInputSchema.parse($fields);
      await onSubmit($fields);
      loading = false;
      $goto(to);
    } catch (error) {
      if (error instanceof ZodError) {
        if (error instanceof ZodError) {
          $fieldsErrors = error.flatten().fieldErrors;
          notify(`${error.errors[0].message}`, "error");
        }
      }
      loading = false;
    }
  }

  function cancelHandler() {
    $goto(to);
  }
</script>

<Modal {title}>
  <Form schema={BankInputSchema} values={bank} bind:fields>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-6">
            <label for="bank">Pilih Bank</label>
            <ComboxField items={bankList} name="name" />
          </div>
          <div class="form-group col-6">
            <label for="accountBank">Cabang</label>
            <InputField
              id="accountBank"
              name="branch"
              type="text"
              class="form-control"
              placeholder="Cabang"
            />
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
            <label for="account">Akun Perkiraan</label>
            <AccountSelect allowEmpty />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-6">
            <label for="balance">Saldo Terakhir</label>
            <InputNumberField id="balance" name="balance" class="form-control" signed={false} />
          </div>
          <div class="form-group col-md-6">
            <label for="date">Tanggal</label>
            <InputDateField id="date" name="date" class="form-control" placeholder="Tanggal" />
          </div>
        </div>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
      <i class="fal fa-save mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
