<!--routify:options title="Akuntansi"-->
<script>
  import { transformPreferenceAccountingForm, transformPreferenceAccountingInput, PreferenceAccountingFormSchema } from "@deboxsoft/accounting-api";
  import { goto, url } from "@roxi/routify";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "./_acl-context";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import Alert from "__@comps/Alert.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "akuntansi" });
  const { readGranted, updateGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { preferenceStore, save } = stores.getPreferenceAccountingContext();

  let fields,
    fieldsErrors,
    submitting = false,
    messageNotify,
    alertOpen,
    alertType,
    isValid,
    startBoot = true,
    values;

  $: {
    if (startBoot && $preferenceStore) {
      startBoot = false;
      values = transformPreferenceAccountingForm($preferenceStore);
    }
  }

  async function saveHandler() {
    try {
      messageNotify = "";
      alertOpen = false;
      $loading = true;
      submitting = true;
      const _transform = transformPreferenceAccountingInput($fields.balanceSheet, $fields.statementIncome);
      const input = _transform.parse($fields);
      await save(input);
      messageNotify = "data berhasil tersimpan";
      notify(messageNotify, "success");
      alertType = "success";
    } catch (e) {
      messageNotify = e.message;
      notify(messageNotify, "error");
      alertType = "danger";
    } finally {
      alertOpen = true;
      $loading = false;
      submitting = false;
    }
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="card">
    <div class="card-body">
      {#if values}
        <Form
          checkValidateFirst
          values={{ ...values }}
          schema={PreferenceAccountingFormSchema}
          bind:fields
          bind:fieldsErrors
          bind:isValid
        >
          <Alert message={messageNotify} open={alertOpen} type={alertType} />
          <fieldset>
            <legend class="font-weight-bold">Klasifikasi Kode Akun</legend>
            <div class="row">
              <div class="form-group col-12 col-md-6">
                <label for="stock">Induk Akun Persediaan</label>
                <InputField
                  id="stock"
                  name="stock"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Persediaan"
                />
              </div>
              <div class="form-group col-12 col-md-6">
                <label for="stock">Kode depan kelompok kas</label>
                <InputField
                  id="cash"
                  name="cash"
                  type="text"
                  class="form-control"
                  placeholder="Kode depan kelompok kas"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12 col-md-6">
                <label for="stock">Kode depan kelompok pendapatan</label>
                <InputField
                  id="revenue"
                  name="revenue"
                  type="text"
                  class="form-control"
                  placeholder="Kode depan kelompok pendaptan"
                />
              </div>
              <div class="form-group col-12 col-md-6">
                <label for="stock">Kode depan kelompok biaya</label>
                <InputField
                  id="expense"
                  name="expense"
                  type="text"
                  class="form-control"
                  placeholder="Kode depan kelompok biaya"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12 col-md-4">
                <label for="bdd">Induk Akun BDD</label>
                <InputField id="bdd" name="bdd" type="text" class="form-control" placeholder="Induk Akun BDD" />
              </div>
              <div class="form-group col-12 col-md-4">
                <label for="expenseDepreciation">Induk Akun Biaya Amortisasi</label>
                <InputField
                  id="expenseDepreciation"
                  name="expenseDepreciation"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Biaya Amortisasi"
                />
              </div>
              <div class="form-group col-12 col-md-4">
                <label for="accumulationAmortization">Induk Akun Akumlasi Amortisasi</label>
                <InputField
                  id="accumulationAmortization"
                  name="accumulationAmortization"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Akumlasi Amortisasi"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12 col-md-4">
                <label for="inventory">Induk Akun Aktiva Tetap</label>
                <InputField
                  id="inventory"
                  name="inventory"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Aktiva Tetap"
                />
              </div>
              <div class="form-group col-12 col-md-4">
                <label for="expenseDepreciation">Induk Akun Biaya Penyusutan</label>
                <InputField
                  id="expenseDepreciation"
                  name="expenseDepreciation"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Biaya Penyusutan"
                />
              </div>
              <div class="form-group col-12 col-md-4">
                <label for="accumulationDepreciation">Induk Akun Akumlasi Penyusutan</label>
                <InputField
                  id="accumulationDepreciation"
                  name="accumulationDepreciation"
                  type="text"
                  class="form-control"
                  placeholder="Induk Akun Akumlasi Penyusutan"
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="font-weight-bold">Jadwal</legend>
            <div class="row">
              <div class="form-group col-12 col-md-6">
                <label for="verificationTimeTransaction">Jam Fixed Transaksi</label>
                <InputNumberField
                  id="verificationTimeTransaction"
                  name="verificationTimeTransaction"
                  format="number"
                  class="form-control"
                  placeholder="Jadwal Jam Fixed Transaksi"
                  maximumValue="23"
                  minimumValue="0"
                />
              </div>
              <div class="form-group col-12 col-md-6">
                <label for="depreciationSchedule">Tanggal Penyusutan Aktiva Tetap</label>
                <InputNumberField
                  id="depreciationSchedule"
                  name="depreciationSchedule"
                  class="form-control"
                  format="number"
                  placeholder="Jadwal Tanggal Penyusutan Aktiva Tetap"
                  maximumValue="28"
                  minimumValue="1"
                />
              </div>
            </div>
          </fieldset>
        </Form>
      {/if}
    </div>
    <div class="card-footer text-right">
      <button class="btn bg-primary" on:click={saveHandler} disabled={!$isValid || submitting}>Simpan</button>
    </div>
  </div>
</PageLayout>
