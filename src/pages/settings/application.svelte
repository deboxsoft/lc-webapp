<script>
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getCompanyContext } from "__@modules/accounting";
  import { writable } from "svelte/store";

  const { notify, loading } = getApplicationContext();
  const { companyStore, update } = getCompanyContext();

  let fields = writable({});

  $: submitting = $loading;

  async function saveHandler() {
    try {
      $loading = true;
      await update($fields);
      $loading = false;
      notify("data berhasil tersimpan", "success");
    } catch (e) {
      $loading = false;
      notify(e.message, "error");
    }
  }
</script>

<Form feedbackValidateDisable bind:fields values={$companyStore} on:submit={saveHandler}>
  <div class="card">
    <div class="card-body">
      <div class="form-group col-12">
        <label for="name">Nama Perusahaan</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama Perusahaan" />
      </div>
      <div class="form-group col-12">
        <label for="unit">Unit</label>
        <InputField id="unit" name="unit" type="text" class="form-control" placeholder="Unit" />
      </div>
    </div>
    <div class="card-footer text-right">
      <button class="btn bg-primary" on:click={saveHandler} disabled={submitting}>Simpan</button>
    </div>
  </div>
</Form>
