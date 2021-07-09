<!--routify:options title="Update Bank"-->
<script>
  import {onMount} from "svelte";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormBank from "../_components/FormBank.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  let openDialog;

  onMount(() => {
    openDialog()
  })
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getBank } = stores.getBankContext();
  const { loading, notify } = getApplicationContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($params.id, values);
      notify(`Berhasil mengupdate data bank`, "success");
      $loading = false;
    } catch (e) {
      $loading = false;
    }
  }
</script>

<FormBank bind:openDialog bank={$bank} isUpdate {onSubmit} title="Update Bank" to={$params.to} />
