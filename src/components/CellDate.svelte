<script>
  import { dayjs } from "@deboxsoft/accounting-api";

  export let format = "DD-MM-YYYY";
  export let date = undefined;
</script>

{dayjs(date).format(format) || ""}
