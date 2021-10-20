<script>
  export let status;
</script>

<span
  class="badge"
  class:badge-primary={status === "UNAPPROVED"}
  class:badge-danger={status === "REJECTED"}
  class:badge-light={status === "FIXED"}
  class:badge-success={status === "APPROVED"}>{status || ""}</span
>