<script>
  import * as z from "@deboxsoft/zod";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { authenticationStore, changePassword } = getAuthenticationContext();
  const schema = z.object({
    password: z.string().min(5, { message: "password harus terdiri 5 karakter atau lebih" }),
    newPassword: z.string().min(5, { message: "password harus terdiri 5 karakter atau lebih" }),
    confirmPassword: z
      .string()
      .min(5, { message: "password harus terdiri 5 karakter atau lebih" })
      .refine(() => $fields.newPassword === $fields.confirmPassword, {
        message: "Konfirmasi password dan password baru tidak sama"
      })
  });

  let fields;
  let submitted;
  let submitHandler;
  $: url = $params.backUrl || "./";
  $: profile = $authenticationStore.profile;

  async function saveHandler() {
    submitHandler();
    try {
      schema.parse($fields);
      $loading = true;
      await changePassword(profile.id, $fields.newPassword, $fields.password);
      notify("Berhasil mengganti password", "success");
      $loading = false;
      $goto(url);
    } catch (e) {
      if (typeof e === "string") notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(url);
  }
</script>

<Modal class="modal-lg" open title="Ganti Password">
  <Form bind:fields {schema} bind:submitted bind:submitHandler>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-12">
            <label for="password">Password</label>
            <InputField id="password" type="password" name="password" class="form-control" autocomplete="password" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="newPassword">Password Baru</label>
            <InputField
              id="newPassword"
              type="password"
              name="newPassword"
              class="form-control"
              autocomplete="newPassword"
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="confirmPassword">Konfirmasi Password</label>
            <InputField
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              class="form-control"
              autocomplete="confirmPassword"
            />
          </div>
        </div>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Ganti Password</button>
  </svelte:fragment>
</Modal>
