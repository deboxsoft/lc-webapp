<script>
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";

  function saveHandler() {}

</script>
<Form>
  <div class="card">
    <div class="card-body">
      <div class="form-group col-12">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
      <div class="form-group col-12">
        <label for="email">Email</label>
        <InputField id="email" name="email" type="text" class="form-control" placeholder="Email" />
      </div>
    </div>
    <div class="card-footer text-right">
      <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
    </div>
  </div>
</Form>