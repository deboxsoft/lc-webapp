<script>
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";

  async function saveHandler() {
    // await save(accountId);
  }
</script>

<Form>
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
      <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
    </div>
  </div>
</Form>
