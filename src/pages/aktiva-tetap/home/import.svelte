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
      const datePurchase = parseDate(result.data[6]);
      if (datePurchase) {
        const quantity = 1;
        output.push({
          datePurchase,
          name: sanitizeString(result.data[1]).toUpperCase(),
          quantity: sanitizeNumber(result.data[3]),
          priceItem: sanitizeNumber(result.data[4]) / quantity
        });
      }
    };
  };

  const title = "Impor aktiva Tetap";
  let fileLoaded = false;
  let files = writable([]);
  let submitting = false;
  let errors = [];
  let submit, openDialog, closeDialog, categoryId;

  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler() {
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
    categoryId = detail;
  }
</script>

<FormImport
  bind:fileLoaded
  bind:files
  bind:errors
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
    <div class="row">
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
  </div>
  <TablePreview bind:submit dataList={fileData} bind:errors />
</FormImport>
