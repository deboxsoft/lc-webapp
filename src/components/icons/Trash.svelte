<script>
  export let viewBox = "0 0 24 24";

  /**
   *
   * @type {string} [htmlColor]
   */
  export let htmlColor = undefined;
</script>

<svg {...$$restProps} {viewBox} color={htmlColor} role="img">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3zm-2-1H9v1h6V4zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z" />
  <path d="M9 9h2v8H9V9z" />
  <path d="M13 9h2v8h-2V9z" />
  <title>Trash</title>
</svg>
