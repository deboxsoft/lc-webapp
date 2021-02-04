<script>
  export let viewBox = "0 0 64 512";
  // props
  export let htmlColor = undefined;
  export let title = ''
  const { class: className } = $$props;
</script>

<svg {...$$restProps} {viewBox} color={htmlColor} role="img" class="dbx-icon -type-svg {className}">
  <path d="M32 224c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM0 136c0 17.7 14.3 32 32 32s32-14.3 32-32-14.3-32-32-32-32 14.3-32 32zm0 240c0 17.7 14.3 32 32 32s32-14.3 32-32-14.3-32-32-32-32 14.3-32 32z"/>
  <title>{title}</title>
</svg>

