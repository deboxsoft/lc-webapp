<script>
import dayjs from "dayjs";

export let format = "DD-MM-YY";
export let date = undefined;

</script>

{dayjs(date).format(format) || ""}