<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { FormStore } from "@deboxsoft/svelte-forms";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import LockRoundedIcon from "@deboxsoft/svelte-icons/LockRounded.svelte";
  import ArrowRightIcon from "@deboxsoft/svelte-icons/KeyboardArrowRight.svelte";
  import PersonIcon from "@deboxsoft/svelte-icons/PersonOutlined.svelte";
  import LockIcon from "@deboxsoft/svelte-icons/LockOutlined.svelte";
  // import { authStore } from "__@root/stores/auth";

  // const { login } = authStore;
  let formClass;
  let submitCount;
  let errors;
  let formStore: FormStore;
  const validation = {
    // username: (value: any) => yup.string().required().min(5).validate(value),
    // password: (value: any) => yup.string().required().min(5).validate(value)
  };

  async function submitHandler() {
    formStore.updateField("username", { touched: true });

    await formStore.submit(async () => {
      // await login();
    });
    submitCount = formStore.submitCount;
    errors = formStore.getErrors();
  }

  $: {
    formClass = clsx("login-form");
  }
</script>

<style lang="scss" global>
  .login-form {
    .lock-icon {
      font-size: 5rem;
      color: #90a4ae;
    }
  }
</style>

<!-- Login form -->
<Form class={formClass} on:submit={submitHandler} bind:formStore>
  <div class="card mb-0">
    <div class="card-body">
      <div class="text-center mb-3">
        <Icon
          component={LockRoundedIcon}
          class="lock-icon text-slate-300 border-slate-300 border-3 rounded-round p-3 mb-3 mt-1" />
        <h5 class="mb-0">Login</h5>
        <span class="d-block text-muted">Sistem Akuntansi</span>
      </div>

      <div class="form-group form-group-feedback form-group-feedback-left">
        <InputField
          name="username"
          type="text"
          class="form-control"
          invalidClass="validation-invalid-label"
          placeholder="Username"
          autocomplete="username"
          validate={validation.username}
          required>
          <div class="form-control-feedback">
            <Icon component={PersonIcon} class="text-muted" size="small" />
          </div>
        </InputField>
      </div>

      <div class="form-group form-group-feedback form-group-feedback-left">
        <InputField
          name="password"
          type="password"
          class="form-control"
          invalidClass="validation-invalid-label"
          placeholder="Password"
          autocomplete="current-password"
          validate={validation.password}
          required>
          <div class="form-control-feedback">
            <Icon component={LockIcon} class="text-muted" size="small" />
          </div>
        </InputField>
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary btn-block">Sign in
          <Icon component={ArrowRightIcon} class="ml2" /></button>
      </div>

      <div class="text-center"><a href="login_password_recover.html">Forgot password?</a></div>
    </div>
  </div>
</Form>
<!-- /login form -->
