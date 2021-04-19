<!--routify:options title="Create Bank"-->
<script>
  import { params } from "@roxi/routify";
  import { getBankContext, getPreferenceContext } from "__@modules/accounting";
  import FormBank from "./_components/FormBank.svelte";

  const {currentDateStore} = getPreferenceContext();
  const { create } = getBankContext();

  let bank = {
    date: $currentDateStore
  };

  async function onSubmit(values) {
    await create(values);
  }
</script>

<FormBank {bank} title="Membuat Data Bank" {onSubmit} to={$params.to} />
