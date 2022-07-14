<!--routify:options title="Impor Aktiva Tetap"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "../_components/TablePreview.svelte";
  import { sanitizeNumber, sanitizeString, parseDate } from "__@root/utils";
  import { stores } from "@deboxsoft/accounting-client";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { loading, notify } = getApplicationContext();
  const { import: importInventories, getCategoryInventory, categoryInventoryStore } = stores.getInventoryContext();

  /**
   *
   * @param output {import("@deboxsoft/accounting-api").InventoryInput[]}
   * @return {(function(*, *): void)|*}
   */
  const transformStep = (output) => {
    return (result, self) => {
      const datePurchase = parseDate(result.data[5]);
      if (datePurchase) {
        const quantity = 1;
        output.push({
          datePurchase,
          name: sanitizeString(result.data[1]).toUpperCase(),
          quantity: sanitizeNumber(result.data[2]),
          priceItem: sanitizeNumber(result.data[3]) / quantity
        });
      }
    };
  };

  const title = "Impor aktiva Tetap";
  let fileLoaded = false;
  let files = writable([]);
  let submitting = false;
  let isPreview;
  let errors = [];
  let submit, openDialog, closeDialog, statusFormState;
  export let categoryId;

  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler() {
    if (!categoryId) {
      throw new Error("kategori harus diisi.");
    }
    errors = [];
    const inputs = submit();
    if (!errors || errors.length === 0) {
      await importInventories(inputs.map((_) => ({ ..._, categoryId })));
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
    if (!categoryId) {
      throw new Error("Kategori belum dipilih.");
    }
    if (listData) {
      listData.forEach((_, index) => {
        if (_.name === "" || _.datePurchase === "" || _.priceItem === "" || _.quantity === "") {
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

  function categoryHandler({ detail }) {
    categoryId = detail?.id;
    if (categoryId) {
      statusFormState = "verified";
    } else {
      statusFormState = "unverified";
    }
  }
</script>

<FormImport
  bind:statusFormState
  bind:fileLoaded
  bind:files
  bind:errors
  bind:isPreview
  bind:openDialog
  bind:closeDialog
  let:fileData
  {title}
  {transformStep}
  onPreview={previewHandler}
  onClose={closeHandler}
  onSubmit={submitHandler}
>
  <div class="border-bottom-grey-200 border-bottom-1 mb-1 pb-1" slot="info">
    <div class="row form-group">
      <div class="col-12 col-md-3">
        <label for="categoryId">Kategori</label>
      </div>
      <div class="col-12 col-md-9">
        <ComboxField
          id="categoryId"
          name="categoryId"
          class="form-control"
          items={$categoryInventoryStore}
          valueId="id"
          labelId="name"
          placeholder="Kategori"
          on:change={categoryHandler}
        />
      </div>
    </div>
    {#if !isPreview}
      <dl class="row mb-0">
        <dt class="col-sm-3 mb-0">Download Template</dt>
        <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
          :
          <a href={`/templates/inventaris.csv`} class="ml-1" target="_self">inventaris.csv</a>
        </p>
      </dl>
    {/if}
  </div>
  <TablePreview bind:submit dataList={fileData} bind:errors />
</FormImport>
