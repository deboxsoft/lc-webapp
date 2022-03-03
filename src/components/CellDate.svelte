<script>
  import dayjs from "dayjs";

  export let format = "DD-MM-YYYY";
  export let date = undefined;
</script>

{dayjs(date).format(format) || ""}
