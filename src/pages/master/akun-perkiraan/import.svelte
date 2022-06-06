<!--routify:options title="Impor Akun"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto, params } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_components/TablePreview.svelte";
  import { sanitizeNumber, sanitizeString } from "__@root/utils";

  const { loading, notify } = getApplicationContext();
  const { getAccount, accountStore, import: importAccount } = stores.getAccountContext();

  // tranform step from csv
  const transformStep = (output) => {
    return (result, self) => {
      const id = sanitizeNumber(result.data[0]);
      if (id) {
        output.push({
          id: id.toString(),
          parentId: sanitizeString(`${result.data[1]}`),
          name: sanitizeString(`${result.data[2]}`).toUpperCase(),
          startBalance: sanitizeNumber(result.data[3])
        });
      }
    };
  };

  /**
   *
   * @type {"journal" | "payment" | "cashier"}
   */
  const action = $params.action;
  const title = "Impor Akun Perkiraan";
  let fileLoaded = false;
  let files = writable([]);
  let submitting = false;
  let errors = [];
  let balance = 0;
  let submit, openDialog, closeDialog, isPreview;

  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler() {
    errors = [];
    const inputs = submit();
    if (!errors || errors.length === 0) {
      await importAccount(inputs);
      $goto("./");
    } else {
      throw errors;
    }
  }

  /**
   *
   * @param listData {*[]}
   */
  function previewHandler(listData) {
    errors = [];
    if (listData) {
      listData.forEach((_, index) => {
        if (_.id === "" || _.name === "") {
          errors.push(index);
        }
      });
    }
    if (errors.length > 0 || !listData || listData.length === 0) {
      throw new Error("Terjadi kesalahan input data, mohon diperiksa kembali.");
    }
  }

  function closeHandler() {
    fileLoaded = false;
    files.set([]);
    $goto("./");
  }
</script>

<FormImport
  bind:fileLoaded
  bind:files
  bind:errors
  bind:openDialog
  bind:closeDialog
  bind:isPreview
  let:fileData
  {title}
  {transformStep}
  onPreview={previewHandler}
  onClose={closeHandler}
  onSubmit={submitHandler}
>
  <svelte:fragment slot="info">
    {#if !isPreview}
      <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
        <dl class="row mb-0">
          <dt class="col-sm-3 mb-0">Download Template</dt>
          <p class="col-sm-9 d-inline-flex align-items-center mb-0">
            :<a href={`/templates/akun-perkiraan.csv`} class="ml-1" target="_self">akun-perkiraan.csv</a>
          </p>
        </dl>
      </div>
    {/if}
  </svelte:fragment>
  <TablePreview bind:submit dataList={fileData} bind:errors />
</FormImport>
