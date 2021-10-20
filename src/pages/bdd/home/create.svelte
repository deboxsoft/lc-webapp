<!--routify:options title="Posting Bdd"-->
<script>
  import { BddInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import BddForm from "../_components/BddForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import dayjs from "dayjs";

  const { getUserId } = getAuthenticationContext();
  const { notify } = getApplicationContext();
  const { create } = stores.getBddContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let bdd;
  (async () => {
    const now = await getCurrentDate();
    bdd = {
      date: now,
      dateStart: now,
      dateEnd: dayjs().add(1, "year").toDate(),
      userId: getUserId()
    };
  })();

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data bdd ${values.description}`, "success");
  }
</script>
{#if bdd}
  <BddForm {bdd} schema={BddInputSchema} title="Posting Bdd" {onSubmit} />
{/if}
