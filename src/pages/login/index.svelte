<script lang="ts">
  import { goto } from "@roxi/routify";
  import * as z from "@deboxsoft/zod";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import LockRoundedIcon from "@deboxsoft/svelte-icons/LockRounded.svelte";
  import ArrowRightIcon from "@deboxsoft/svelte-icons/KeyboardArrowRight.svelte";
  import PersonIcon from "@deboxsoft/svelte-icons/PersonOutlined.svelte";
  import LockIcon from "@deboxsoft/svelte-icons/LockOutlined.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import {jwtStore} from "__@stores/session"

  const { login } = getAuthenticationContext();
  const { notify } = getApplicationContext();

  const schema = z.object({
    username: z.string().min(5).nonempty(),
    password: z.string().min(5).nonempty()
  });

  // state
  let formClass;
  let fields;
  let authenticationStore;

  async function submitHandler() {
    try {
      authenticationStore = await login({ username: $fields.username }, $fields.password);
      jwtStore.set($authenticationStore.session.token);
      jwtStore.useLocalStorage();
      $goto("/");
    } catch (e) {
      notify("Gagal login");
    }
  }

  $: {
    formClass = clsx("login-form");
  }
</script>

<!-- Login form -->
<Form class={formClass} on:submit={submitHandler} bind:fields {schema}>
  <div class="card mb-0">
    <div class="card-body">
      <div class="text-center mb-3">
        <Icon
          component={LockRoundedIcon}
          class="lock-icon text-slate-300 border-slate-300 border-3 rounded-round p-3 mb-3 mt-1"
        />
        <h5 class="mb-0">Login</h5>
        <span class="d-block text-muted">Sistem Akuntansi</span>
      </div>

      <div class="form-group form-group-feedback form-group-feedback-left">
        <InputField class="form-control" name="username" type="text" placeholder="Username" autocomplete="username" />
        <div class="form-control-feedback">
          <Icon component={PersonIcon} class="text-muted" size="small" />
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
          <Icon component={LockIcon} class="text-muted" size="small" />
        </div>
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary btn-block"
          >Masuk
          <Icon component={ArrowRightIcon} class="ml2" /></button
        >
      </div>

      <!--      <div class="text-center"><a href="login_password_recover.html">Forgot password?</a></div>-->
    </div>
  </div>
</Form>

<!-- /login form -->
<style lang="scss" global>
  .login-form {
    .lock-icon {
      font-size: 5rem;
      color: #90a4ae;
    }
  }
</style>
