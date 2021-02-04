<script>
  export let viewBox = "0 0 512 512";

  /**
   *
   * @type {string} [htmlColor]
   */
  export let htmlColor = undefined;
  export let title = ''
  const { class: className } = $$props;
</script>

<svg {...$$restProps} {viewBox} color={htmlColor} role="img" class="dbx-icon -type-svg {className}">
  <path d="M247.759 14.358L16 125.946V184h480v-58.362zM464 152H48v-5.946l200.241-96.412L464 146.362z" />
  <path d="M48 408h416v32H48z" />
  <path d="M16 464h480v32H16z" />
  <path d="M56 216h32v160H56z" />
  <path d="M424 216h32v160h-32z" />
  <path d="M328 216h32v160h-32z" />
  <path d="M152 216h32v160h-32z" />
  <path d="M240 216h32v160h-32z" />
  <title>{title}</title>
</svg>
