<!--routify:options title="profil"-->
<script>
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getUserContext } from "__@modules/users";

  const { companyStore } = getPreferenceContext();

  function saveHandler() {}

  function changePasswordHandler() {}
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
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <label for="password">Password</label>
          <input type="password" name="password" class="form-control" />
        </div>
        <div class="col-md-6">
          <label for="newPassword">Password Baru</label>
          <input type="password" name="newPassword" class="form-control" />
        </div>
      </div>
    </div>
    <div class="card-footer text-right">
      <button class="btn bg-primary" on:click={changePasswordHandler}>Ganti Password</button>
    </div>
  </div>
</Form>
