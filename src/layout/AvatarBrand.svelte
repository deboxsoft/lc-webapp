<script>
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Avatar, { submitting as submittingAvatar } from "__@comps/Avatar.svelte";

  export let submitting = submittingAvatar;
  const { config } = getApplicationContext();
  const { authenticationStore } = getAuthenticationContext();
  let profile, label, srcImg;

  $: {
    profile = $authenticationStore && $authenticationStore.profile;
    if (profile) {
      label = label.displayName;
      srcImg = `${$config.avatarUrl}${profile.id}/${profile.avatar}`;
    }
  }
</script>

<Avatar {label} src={srcImg} />