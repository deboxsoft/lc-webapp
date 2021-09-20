<!--routify:options title="Aplikasi"-->
<script>
  import { CompanySchema } from "@deboxsoft/accounting-api";
  import { goto, url } from "@roxi/routify";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { writable } from "svelte/store";
  import { createAclContext } from "./_acl-context";
  import BrandUpload from "./_BrandUpload.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Alert from "__@comps/Alert.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "akuntansi" });
  const { readGranted, updateGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { companyStore, update } = stores.getCompanyContext();
  const schema = CompanySchema.omit({ address: true, divisions: true });

  let fields,
    company,
    submitting = false,
    messageNotify,
    alertMessage,
    alertOpen,
    alertType,
    isStartup = true,
    isValid,
    fieldsErrors;

  $: {
    if (isStartup && $companyStore) {
      isStartup = false;
      company = $companyStore;
    }
  }

  async function saveHandler() {
    try {
      messageNotify = "";
      alertOpen = false;
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await update(input);
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
  <Form checkValidateFirst bind:fields values={company} {schema} bind:isValid bind:fieldsErrors>
    <div class="card">
      <div class="card-body">
        <Alert message={messageNotify} open={alertOpen} type={alertType} />
        <div class="row">
          <div class="col-2 d-flex justify-content-center">
            <BrandUpload size="125px" />
          </div>
          <div class="col-10">
            <div class="form-group col-12">
              <label for="name">Nama Perusahaan</label>
              <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama Perusahaan" />
            </div>
            <div class="form-group col-12">
              <label for="unit">Unit</label>
              <InputField id="unit" name="unit" type="text" class="form-control" placeholder="Unit" />
            </div>
          </div>
        </div>
      </div>
      {#if updateGranted}
        <div class="card-footer text-right">
          <button class="btn bg-primary" on:click={saveHandler} disabled={submitting || !$isValid}>Simpan</button>
        </div>
      {/if}
    </div>
  </Form>
</PageLayout>
