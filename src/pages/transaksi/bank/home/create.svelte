<!--routify:options title="Create Bank"-->
<script>
  import { onMount} from "svelte";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormBank from "./_components/FormBank.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { currentDateStore } = stores.getPreferenceAccountingContext();
  const { create } = stores.getBankContext();

  $loading = true;
  let openDialog;
  onMount(() => {
    openDialog();
    $loading = false;
  });
  let bank = {
    date: $currentDateStore
  };

  async function onSubmit(values) {
    try {
      $loading = true;
      await create(values);
      $loading = false;
      notify(`Berhasil membuat data bank ${values.name}`, "success");
      $goto("./")
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }
</script>

<FormBank bind:openDialog {bank} title="Membuat Data Bank" {onSubmit} to={$params.to} />
