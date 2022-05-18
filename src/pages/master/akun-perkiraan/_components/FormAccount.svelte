<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { beforeUpdate, onMount } from "svelte";
  import { AccountSchema } from "@deboxsoft/accounting-api";
  import { writable, get } from "svelte/store";
  import { sortUtilsFunc } from "__@root/utils";

  // components
  import Modal from "__@comps/Modal.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import InputCheck from "__@comps/forms/InputCheckSwitchery.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  // context
  const { notify } = getApplicationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const { accountStore, getAccount, getAccountParentList, getAccountChildren } = stores.getAccountContext();
  const parentAccountStore = getAccountParentList();
  // const accountType = derived([preferenceStore], ([_preferenceStore]) => {
  //   const accountUtils = createAccountUtils(_preferenceStore);
  //   return [
  //     {
  //       code: _preferenceStore.codeAccount.assets,
  //       label: $t("account.assets")
  //     },
  //     {
  //       code: _preferenceStore.codeAccount.receivable,
  //       label: $t("account.assets")
  //     },
  //     {
  //       code: _preferenceStore.codeAccount.assets,
  //       label: $t("account.assets")
  //     }
  //   ];
  // });

  export let account = {};
  export let isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "../";
  let openDialog;
  let loading = false;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);
  let codeState = "";
  let accountState = writable({});
  let isParent;
  let _autoCode = false;
  let _tmpId = "";
  let _tmpIdAsParent = "";
  let _parentIdTmp = "";

  // hack
  let pathsError = {
    id: "kode",
    name: "nama"
  };

  onMount(() => {
    openDialog();
  });

  beforeUpdate(() => {
    if (!isUpdate && idReadOnly) {
      genCode();
    }
  });

  // kode otomatis
  function genCode() {
    if ($accountState.parentId) {
      const _parentId = $accountState.parentId;
      const children = get(getAccountChildren(_parentId));
      if (children && children.length > 0) {
        $accountState.id = (parseInt(children.sort(sortUtilsFunc("id", "desc"))[0].id) + 1).toString();
      } else if (_parentId) {
        $accountState.id = (parseInt(_parentId) + 1).toString();
      }
    }
  }

  async function submitHandler(e) {
    loading = true;
    try {
      $submitted = true;

      // to uppercase
      $accountState.name = $accountState.name.toUpperCase();
      AccountSchema.parse($accountState);
      await onSubmit($accountState);
      loading = false;
      closeHandler();
    } catch (error) {
      if (error instanceof ZodError) {
        $fieldsErrors = error.flatten().fieldErrors;
        notify(
          `${pathsError[error.errors[0].path[0]] || error.errors[0].path[0]}: ${error.errors[0].message}`,
          "error"
        );
      }
      loading = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }

  function idCustomHandler() {
    if (!idReadOnly) {
      const __tmp = $accountState.id;
      $accountState.id = _tmpId;
      _tmpId = __tmp;
    } else if (_tmpId) {
      $accountState.id = _tmpId;
    }
    idReadOnly = !idReadOnly;
  }

  function parentChangeHandler() {
    genCode();
  }

  function isParentChangeHandler(e) {
    const __account = get(accountState);
    if (__account.isParent) {
      _parentIdTmp = __account.parentId;
      delete __account.parentId;
      __account.id = _tmpIdAsParent;
    } else {
      __account.parentId = _parentIdTmp;
      _tmpIdAsParent = __account.id;
      __account.id = _tmpId;
    }
    $accountState = __account;
  }

  function keyHandler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  }
</script>

<Modal {title} onClose={closeHandler} bind:openDialog>
  <Form
    {submitted}
    {fieldsErrors}
    bind:fields={accountState}
    ignoreAttribs={[]}
    schema={AccountSchema}
    values={account}
  >
    <div class="card">
      <!--      <div class="card-header border-bottom-1 border-bottom-grey">-->
      <!--        {#if isParent}-->
      <!--          <div class="card-title">Induk Akun Perkiraan</div>-->
      <!--        {:else}-->
      <!--          <div class="card-title">Akun Perkiraan</div>-->
      <!--        {/if}-->
      <!--      </div>-->
      <div class="card-body" style="height: 388px">
        <div class="row">
          <div class="form-group  col-12">
            <InputCheck
              id="isParent"
              tabindex="1"
              name="isParent"
              on:change={isParentChangeHandler}
              disabled={isUpdate}
            >
              Akun sebagai induk
            </InputCheck>
          </div>
        </div>
        {#if !$accountState.isParent}
          <div class="row">
            <div class="form-group col-12">
              <label for="parentId">Induk Akun</label>
              <AccountSelect
                on:change={parentChangeHandler}
                id="parentId"
                name="parentId"
                accountStore={parentAccountStore}
                disabled={isUpdate}
                allowEmpty
                on:keypress={keyHandler}
              />
            </div>
          </div>
        {/if}
        <div class="row">
          <div class="form-group col-12">
            <label for="id">Kode</label>
            <InputNumberField
              id="id"
              name="id"
              options={{ decimalPlaces: 0, digitGroupSeparator: "", maximumValue: "9999999999" }}
              prependDisable={true}
              textPosition="left"
              resultType="string"
              format="number"
              class="form-control"
              placeholder="Kode"
              disabled={isUpdate}
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12">
            <label for="name">Nama</label>
            <InputField
              id="name"
              name="name"
              type="text"
              class="form-control"
              placeholder="Nama"
              on:keypress={keyHandler}
            />
          </div>
        </div>
        {#if $accountState.isParent}
          <!--          <div class="row">-->
          <!--            <div class="form-group col-12">-->
          <!--              <label for="type">Klasifikasi Akun</label>-->
          <!--              <ComboBox id="type" name="type" items={accountTypeItems} labelId="label" valueId="code" />-->
          <!--            </div>-->
          <!--          </div>-->
        {:else}
          <div class="row">
            <div class="form-group col-12">
              <label for="type">Saldo Awal</label>
              <InputNumberField id="startBalance" name="startBalance" placeholder="Saldo Awal" />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Batal
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
