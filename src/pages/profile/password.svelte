<!--routify:options title="Ganti Password"-->
<script>
  import * as z from "@deboxsoft/zod";
  import Form from "__@comps/forms/Form.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Alert from "__@comps/Alert.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import InputPasswordField from "__@comps/forms/InputPasswordField.svelte";

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

  let fields,
    profile,
    submitting = false,
    messageNotify,
    alertMessage,
    alertOpen,
    alertType,
    ready = false,
    isValid,
    fieldsErrors;

  $: {
    if (!ready && $authenticationStore) {
      ready = true;
      profile = $authenticationStore.profile;
    }
  }

  async function saveHandler() {
    try {
      const input = schema.parse($fields);
      $loading = true;
      await changePassword(profile.id, input.newPassword, input.password);
      messageNotify = "data berhasil tersimpan";
      notify(messageNotify, "success");
      alertType = "success";
    } catch (e) {
      messageNotify = e.message;
      notify(messageNotify, "error");
      alertType = "danger";
    } finally {
      $fields = {};
      alertOpen = true;
      $loading = false;
      submitting = false;
    }
  }
</script>

<PageLayout breadcrumb={[]}>
  <Form checkValidateFirst bind:fields {schema} bind:isValid>
    <div class="card">
      <div class="card-body">
        <Alert message={messageNotify} open={alertOpen} type={alertType} />
        <div class="row">
          <div class="form-group col-12">
            <label for="password">Password</label>
            <InputPasswordField id="password" class="form-control" name="password" autocomplete="password" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="newPassword">Password Baru</label>
            <InputPasswordField id="newPassword" class="form-control" name="newPassword" autocomplete="newPassword" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="confirmPassword">Konfirmasi Password</label>
            <InputPasswordField
              id="confirmPassword"
              class="form-control"
              name="confirmPassword"
              autocomplete="confirmPassword"
            />
          </div>
        </div>
      </div>
      <div class="card-footer text-right">
        <button class="btn bg-primary" on:click={saveHandler} disabled={submitting || !$isValid}>Ganti Password</button>
      </div>
    </div>
  </Form>
</PageLayout>
