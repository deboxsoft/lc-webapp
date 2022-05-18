<script>
  export let iconClass = "icon-spinner9";
  export let textClass = "";
  const className = $$props.class;
</script>

<div class="d-flex justify-content-center align-items-center h-100 w-100 {className}">
  <i class="spinner text {textClass} {iconClass}" />
</div>
