<!--routify:options title="Impor Persediaan Barang"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_components/TablePreview.svelte";
  import { sanitizeNumber, sanitizeString } from "__@root/utils";
  import { getAuthenticationContext } from "__@modules/users";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { loading, notify } = getApplicationContext();
  const { getAccount, getAccountLeaf, accountStore } = stores.getAccountContext();
  const { authenticationStore, getProfile } = getAuthenticationContext();
  const { import: importProduct } = stores.getProductContext();
  const { categoryProductStore, getCategoryProduct } = stores.getCategoryProductContext();

  // tranform step from csv
  const transformStep = (output) => {
    let i = 0;
    return (result, self) => {
      const no = sanitizeNumber(result.data[0]);
      if (Number.isFinite(no)) {
        output.push({
          id: i,
          no,
          name: sanitizeString(result.data[1]),
          unit: sanitizeString(result.data[2]),
          price: sanitizeNumber(result.data[3]),
          available: sanitizeNumber(result.data[4])
        });
        i++;
      }
    };
  };

  const title = "Impor Barang Persediaan";
  let fileLoaded = false,
    files = writable([]),
    submitting = false,
    errors = [],
    balance = 0,
    categoryId,
    submit,
    statusFormState,
    openDialog,
    closeDialog,
    isPreview;

  $loading = true;
  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler(_data) {
    if (!categoryId) {
      throw new Error("kategori harus diisi.");
    }
    // filter
    errors = [];
    const inputs = _data.map(({ id, no, ..._ }) => {
      return {
        categoryId,
        ..._
      };
    });
    if (!errors || errors.length === 0) {
      await importProduct(inputs);
      $goto("./");
      $loading = false;
    } else {
      throw errors;
    }
  }

  /**
   *
   * @param listData {*[]}
   */
  function previewHandler(listData) {
    if (listData) {
      errors = [];
      listData.forEach((_, index) => {
        if (!_.date || !Number.isFinite(_.amount) || !_.oppositeAccountId) {
          errors.push(index);
        }
      });
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
  bind:isPreview
  bind:errors
  bind:openDialog
  bind:closeDialog
  let:fileData
  {title}
  {transformStep}
  onClose={closeHandler}
  onPreview={previewHandler}
  onSubmit={submitHandler}
>
  <!-- form upload  -->
  <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1" slot="info">
    <div class="row form-group">
      <div class="col-12 col-md-3">
        <label for="categoryId">Kategori</label>
      </div>
      <div class="col-12 col-md-9">
        <ComboxField
          id="categoryId"
          name="categoryId"
          class="form-control"
          items={$categoryProductStore}
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
          <a href={`/templates/barang-persediaan.csv`} class="ml-1" target="_self">barang-persediaan.csv</a>
        </p>
      </dl>
    {/if}
  </div>

  <!-- preview -->
  <TablePreview dataList={fileData} bind:errors />
</FormImport>
