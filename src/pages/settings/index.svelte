<!--routify:options title="profil"-->
<script>
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Avatar from "./_AvatarUpload.svelte";
  import { getUserContext, getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { update } = getUserContext();
  const { notify, loading, config } = getApplicationContext();
  const { authenticationStore } = getAuthenticationContext();

  let fields;
  $: profile = $authenticationStore.profile;

  async function saveHandler() {
    try {
      $loading = true;
      const input = { ...$fields };
      delete input.id;
      delete input.role;
      await update(profile.id, input);
      notify("Berhasil memperbarui data profile", "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

</script>

{#if profile}
  <Form values={profile} bind:fields feedbackValidateDisable>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-2 d-flex justify-content-center">
            <Avatar src={profile.avatar} name={profile.name} size="100px" />
          </div>
          <div class="col-10">
            <div class="form-group col-12">
              <label for="name">Nama</label>
              <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
            </div>
            <div class="form-group col-12">
              <label for="email">Email</label>
              <InputField id="email" name="email" type="text" class="form-control" placeholder="Email" />
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-right">
        <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
      </div>
    </div>
  </Form>
{/if}