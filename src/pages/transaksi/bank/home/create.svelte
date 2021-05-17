<!--routify:options title="Create Bank"-->
<script>
  import { params, goto } from "@roxi/routify";
  import { getBankContext, getPreferenceContext } from "__@modules/accounting";
  import FormBank from "./_components/FormBank.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { currentDateStore } = getPreferenceContext();
  const { create } = getBankContext();

  let bank = {
    date: $currentDateStore
  };

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      $loading = false;
      notify(`Berhasil membuat data bank ${values.name}`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<FormBank {bank} title="Membuat Data Bank" {onSubmit} to={$params.to} />
