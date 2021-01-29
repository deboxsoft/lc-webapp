<script>
  export let viewBox = "0 0 24 24";

  /**
   *
   * @type {string} [htmlColor]
   */
  export let htmlColor = undefined;
</script>

<svg {...$$restProps} {viewBox} color={htmlColor} role="img">
  <path fill="none" stroke="#626262" stroke-width="2" d="M2 7h18m-4-5l5 5l-5 5m6 5H4m4-5l-5 5l5 5" />
  <title>Transaction</title>
</svg>
