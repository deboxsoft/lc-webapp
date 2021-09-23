<!--routify:options title="info"-->
<script>
  import { UpdateGroupSchema } from "@deboxsoft/users-api";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import AvatarUpload from "./_AvatarUpload.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import { createUserService } from "@deboxsoft/users-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Alert from "__@comps/Alert.svelte";
  import { z } from "@deboxsoft/zod";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "info profil" });

  const applicationContext = getApplicationContext();
  const { notify, loading, config } = applicationContext;
  const userService = createUserService(applicationContext);
  const { authenticationStore } = getAuthenticationContext();
  const schema = UpdateGroupSchema.extend({
    username: z.string(),
    email: z.string().email()
  })

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
    if (!ready && $authenticationStore.profile) {
      ready = true;
      getProfileUser($authenticationStore.profile.session.userId).then((_) => {
        profile = _;
      });
    }
  }

  async function getProfileUser(id) {
    $loading = true;
    const user = await userService.findById(id);
    $loading = false;
    return user;
  }

  async function saveHandler() {
    try {
      messageNotify = "";
      alertOpen = false;
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await userService.update(profile.id, input);
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

{#if profile}
  <PageLayout breadcrumb={[]}>
    <Form checkValidateFirst values={profile} {schema} bind:fields bind:isValid>
      <div class="card">
        <div class="card-body">
          <Alert message={messageNotify} open={alertOpen} type={alertType} />
          <div class="row">
            <div class="col-2 d-flex justify-content-center">
              <AvatarUpload label={profile.displayName} size="125px" />
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
          <button class="btn bg-primary" on:click={saveHandler}  disabled={submitting || !$isValid}>Simpan</button>
        </div>
      </div>
    </Form>
  </PageLayout>
{/if}
