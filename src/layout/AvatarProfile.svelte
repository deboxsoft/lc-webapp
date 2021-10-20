<script context="module">
  import { writable } from "svelte/store";

  export let loading = writable(false);
</script>

<script>
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Avatar from "__@comps/Avatar.svelte";

  const { config } = getApplicationContext();
  const { authenticationStore } = getAuthenticationContext();
  let profile, label, srcImg;

  $: {
    profile = $authenticationStore && $authenticationStore.profile;
    if (profile) {
      label = profile.displayName;
      srcImg = `${$config.avatarUrl}${profile.id}/${profile.avatar}`;
    }
  }
</script>

<Avatar {label} src={srcImg} {...$$restProps} loading={$loading}>
  <slot />
</Avatar>
