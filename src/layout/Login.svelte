<script lang="ts">
  import { goto } from "@roxi/routify";
  import { z } from "@deboxsoft/zod";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import IoMdLock from "@deboxsoft/svelte-icons/io/IoMdLock.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Alert from "__@comps/Alert.svelte";

  const { login, jwtStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();

  const schema = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
  });

  // state
  let formClass;
  let fields;
  let authenticationStore;
  let alertMessage;
  let alertOpen;
  let submitted;

  async function submitHandler() {
    try {
      $loading = true;
      authenticationStore = await login({ username: $fields.username }, $fields.password);
      $goto("/");
      $loading = false;
    } catch (e) {
      $submitted = false;
      notify(e.message, "error");
      alertMessage = e.message;
      alertOpen = true;
      $loading = false;
    }
  }

  $: {
    formClass = clsx("login-form");
  }
</script>

<!-- Login form -->
<div class="main-layout">
  <div class="page-content">
    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Content area -->
      <div class="content d-flex justify-content-center align-items-center">
        <Form class={formClass} on:submit={submitHandler} bind:fields bind:submitted {schema}>
          <div class="card mb-0">
            <div class="card-body">
              <div class="text-center mb-3">
                <div class="lock-icon-wrapper text-slate-300 border-slate-300 border-3 rounded-round p-3 mb-3 mt-1">
                  <div class="lock-icon">
                    <IoMdLock />
                  </div>
                </div>
                <h5 class="mb-0">Login</h5>
                <span class="d-block text-muted">Sistem Akuntansi</span>
              </div>
              <Alert bind:message={alertMessage} bind:open={alertOpen} />
              <div class="form-group form-group-feedback form-group-feedback-left">
                <InputField
                  class="form-control"
                  name="username"
                  type="text"
                  placeholder="Username"
                  autocomplete="username"
                />
                <div class="form-control-feedback">
                  <i class="icon-user text-muted" />
                </div>
              </div>

              <div class="form-group form-group-feedback form-group-feedback-left">
                <InputField
                  class="form-control"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autocomplete="password"
                />
                <div class="form-control-feedback">
                  <i class="icon-lock2 text-muted" />
                </div>
              </div>

              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block"
                  >Masuk <i class="icon-circle-right2 ml-2" />
                </button>
              </div>

              <!--      <div class="text-center"><a href="login_password_recover.html">Forgot password?</a></div>-->
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</div>

<!-- /login form -->
<style lang="scss" global>
  .login-form {
    .lock-icon-wrapper {
      width: 80px;
      height: 80px;
      margin-left: auto;
      margin-right: auto;
    }
    .lock-icon {
      width: 34px;
      height: 34px;
    }

    .input-icon-wrapper {
      height: 100%;
      margin-top: auto;
      margin-bottom: auto;
    }
    .form-icon {
      width: 16px;
      height: 16px;
    }
  }
</style>
