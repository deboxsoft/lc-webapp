<script>
  export let viewBox = "0 0 384 512";
  // props
  export let htmlColor = undefined;
  export let title = ''
  const { class: className } = $$props;
</script>

<svg {...$$restProps} {viewBox} color={htmlColor} role="img" class="dbx-icon -type-svg {className}">
  <path d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"/>
  <title>{title}</title>
</svg>

