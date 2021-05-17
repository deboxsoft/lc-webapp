<script lang="ts">
  import { goto } from "@roxi/routify";
  import * as z from "@deboxsoft/zod";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import IoMdLock from '@deboxsoft/svelte-icons/io/IoMdLock.svelte'
  import ArrowRightIcon from "@deboxsoft/svelte-icons/ico/icoArrowRight2.svelte";
  import PersonIcon from "@deboxsoft/svelte-icons/ico/icoUser4.svelte";
  import LockIcon from "@deboxsoft/svelte-icons/ico/icoUserLock2.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Alert from "__@comps/Alert.svelte";

  const { login, jwtStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();

  const schema = z.object({
    username: z.string().min(5).nonempty(),
    password: z.string().min(5).nonempty()
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
        <InputField class="form-control" name="username" type="text" placeholder="Username" autocomplete="username" />
        <div class="h-100 d-flex align-items-center form-control-feedback">
          <div class="form-icon text-muted">
            <PersonIcon />
          </div>
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
        <div class="h-100 d-flex align-items-center form-control-feedback">
          <div class="form-icon text-muted">
            <LockIcon />
          </div>
        </div>
      </div>

      <div class="form-group">
        <button type="submit" class="btn d-flex justify-content-center btn-primary btn-block"
          >Masuk
          <div class="form-icon ml-1" style="padding-top: 4px">
            <ArrowRightIcon />
          </div>
        </button>
      </div>

      <!--      <div class="text-center"><a href="login_password_recover.html">Forgot password?</a></div>-->
    </div>
  </div>
</Form>

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
