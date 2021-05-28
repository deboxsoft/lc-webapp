<!--routify:options title="Import Statement"-->
<script>
  import dayjs from "dayjs";
  import { goto } from "@roxi/routify";
  import FormImport from "./_components/FormImport.svelte";
  import Modal from "__@comps/Modal.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { writable, get } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  const { loading: loadingApp, notify } = getApplicationContext();
  const { getAccount } = stores.getAccountContext();
  const { importStatement, bank } = stores.getBankStatementContext();
  let fileLoaded = false;
  let isPreview = false;
  let fileData = writable(undefined);
  let files = writable([]);
  let itemsSelected;
  let loading = false;
  let errors = [];

  async function submitHandler() {
    $loadingApp = true;
    try {
      // filter
      errors = [];
      const statements = $fileData.filter((_, index) => {
        if ($itemsSelected.includes(index)) {
          const account = get(getAccount(_.accountId));
          if (!account || (!_.in && !_.out)) {
            errors.push(index);
          }
          return true;
        }
        return false;
      });
      if (!errors || errors.length === 0) {
        const _statements = statements.map(({ date, ...data }) => ({
          ...data,
          date: dayjs(date, "DD/MM/YY").toDate()
        }));
        await importStatement($bank.id, _statements);
        $itemsSelected = [];
        notify("data berhasil tersimpan", "success");
        $goto("./");
        $loadingApp = false;
      } else {
        notify("data belum lengkap", "error");
      }
    } catch (e) {
      // notify(e.message, "error");
    } finally {
      $loadingApp = false;
    }
  }

  function previewHandler() {
    isPreview = true;
  }

  function backHandler() {
    isPreview = false;
    fileLoaded = false;
    files.set([]);
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<Modal title="Import Statement Bank" class="modal-full">
  {#if loading}
    <Loader />
  {:else}
    <FormImport bind:fileLoaded bind:fileData bind:isPreview bind:files bind:itemsSelected bind:errors />
  {/if}
  <div slot="footer">
    <button type="button" on:click={cancelHandler} class="btn btn-outline-primary mr-2"
      ><i class="icon-cancel-circle2 mr-2" />Tutup</button
    >
    {#if !isPreview}
      <button type="button" on:click={previewHandler} class="btn bg-primary mr-2" disabled={!fileLoaded}
        ><i class="icon-file-eye2 mr-2" />preview</button
      >
    {:else}
      <button type="button" on:click={backHandler} class="btn btn-outline-primary mr-2"
        ><i class="icon-reset mr-2" />Reset</button
      >
      <button type="button" on:click={submitHandler} class="btn btn-primary mr-2" disabled={!fileLoaded || loading}
        ><i class="icon-floppy-disk mr-2" />Simpan</button
      >
    {/if}
  </div>
</Modal>
