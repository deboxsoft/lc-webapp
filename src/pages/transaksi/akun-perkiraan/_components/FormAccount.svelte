<script>
  import { ZodError } from "@deboxsoft/zod";
  import { goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import { getAccountContext, getPreferenceContext } from "__@modules/accounting";
  import { createEventDispatcher, afterUpdate, onMount, beforeUpdate } from "svelte";
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
  import ComboBox from "__@comps/forms/ComboxField.svelte";
  // import InputRp from "__@comps/forms/InputNumberField.svelte";
  // import InputDate from "__@comps/forms/InputDateField.svelte";

  // context
  const { notify } = getApplicationContext();
  const { preferenceStore } = getPreferenceContext();
  const { accountStore, getAccount, getAccountParentList, accountsType, getAccountChildren } = getAccountContext();
  const dispatch = createEventDispatcher();
  const parentAccountStore = getAccountParentList();

  export let isUpdate = false;
  export let account = {};
  export let onSubmit;
  export let title;
  export let to;
  let loading = false;
  let idReadOnly = true;
  let isParent;
  let tabSelect = 1;
  let fieldsErrors = writable([]);
  let submitted = writable(false);
  let codeState = "";
  let accountState = writable({});
  let _autoCode = false;
  let _tmpId = "";
  let _tmpIdAsParent = "";
  let _parentIdTmp = "";
  let _typeTmp = $accountsType[0];

  // hack
  let pathsError = {
    id: "kode",
    name: "nama"
  };

  beforeUpdate(() => {
    if (!isUpdate && idReadOnly) {
      genCode();
    }
  });

  function setTypeFromParent() {
    const parent = get(getAccount($accountState.parentId));
    if (parent) {
      $accountState.type = parent.type;
    }
  }

  // kode otomatis
  function genCode() {
    if ($accountState.parentId) {
      const _parentId = $accountState.parentId;
      const children = get(getAccountChildren(_parentId));
      if (children && children.length > 0) {
        $accountState.id = (parseInt(children.sort(sortUtilsFunc("id", "desc"))[0].id) + 1).toString();
      } else if (_parentId) {
        $accountState.id = _parentId + "00";
      }
    }
  }

  async function submitHandler(e) {
    loading = true;
    try {
      if (!$accountState.type) {
        setTypeFromParent();
      }
      console.log($accountState);
      $submitted = true;
      AccountSchema.parse($accountState);
      await onSubmit($accountState);
      loading = false;
      $goto(to);
    } catch (error) {
      if (error instanceof ZodError) {
        $fieldsErrors = error.flatten().fieldErrors;
        console.log(error.errors[0]);
        notify(
          `${pathsError[error.errors[0].path[0]] || error.errors[0].path[0]}: ${error.errors[0].message}`,
          "error"
        );
      }
      loading = false;
    }
  }

  function cancelHandler() {
    $goto(to);
  }

  function createTabSelectHandler(tab) {
    return () => {
      tabSelect = tab;
    };
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
    setTypeFromParent();
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
      if (idReadOnly) {
        console.log("lock", _tmpId);
        genCode();
      } else {
        console.log("editable", _tmpId);
        __account.id = _tmpId;
      }
    }
    const __typeTmp = __account.type;
    __account.type = _typeTmp;
    _typeTmp = __typeTmp;
    $accountState = __account;
  }
</script>

<Modal {title}>
  <Form
    {submitted}
    {fieldsErrors}
    bind:fields={accountState}
    ignoreAttribs={[]}
    schema={AccountSchema}
    values={account}
  >
    <div class="card">
      <div class="card-body">
        <!--        Menu Tabs -->
        <ul class="nav nav-tabs nav-tabs-bottom nav-justified">
          <li class="nav-item">
            <a
              href="#/"
              class="nav-link"
              class:active={tabSelect === 1}
              target="_self"
              on:click|preventDefault={createTabSelectHandler(1)}
            >
              Info
            </a>
          </li>
          <!--          <li class="nav-item">-->
          <!--            <a-->
          <!--              href="#/"-->
          <!--              class="nav-link"-->
          <!--              class:active={tabSelect === 2}-->
          <!--              target="_self"-->
          <!--              on:click|preventDefault={createTabSelectHandler(2)}-->
          <!--            >-->
          <!--              Saldo-->
          <!--            </a>-->
          <!--          </li>-->
        </ul>
        <div class="tab-content">
          <!--          form info-->
          <div class="tab-pane fade" class:active={tabSelect === 1} class:show={tabSelect === 1}>
            <div class="row">
              <div class="form-group col-12">
                <label for="id">Kode</label>
                <InputNumberField
                  id="id"
                  name="id"
                  options={{ decimalPlaces: 0, digitGroupSeparator: "", maximumValue: "99999999" }}
                  prependDisable={true}
                  textPosition="left"
                  resultType="string"
                  format="number"
                  class="form-control"
                  placeholder="Kode"
                  readonly={(idReadOnly && !$accountState.isParent) || undefined}
                  disabled={isUpdate}
                >
                  {#if !$accountState.isParent}
                    <div class="input-group-append">
                      <button
                        type="button"
                        class="btn btn-light"
                        on:click|preventDefault={idCustomHandler}
                        disabled={isUpdate}
                      >
                        {#if idReadOnly || undefined}
                          <i class="fal fa-lock-alt" />
                        {:else}
                          <i class="fal fa-lock-open-alt" />
                        {/if}
                      </button>
                    </div>
                  {/if}
                </InputNumberField>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for="name">Nama</label>
                <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
              </div>
            </div>
            {#if $accountState.isParent}
              <div class="row">
                <div class="form-group col-12">
                  <label for="type">Klasifikasi Akun</label>
                  <ComboBox id="type" name="type" items={$accountsType} labelId="label" valueId="code" />
                </div>
              </div>
            {:else}
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
                  />
                </div>
              </div>
            {/if}
            <div class="row">
              <div class="form-group  col-12">
                <InputCheck id="isParent" name="isParent" on:change={isParentChangeHandler} disabled={isUpdate}>
                  Akun sebagai induk
                </InputCheck>
              </div>
            </div>
          </div>
          <!--          <div class="tab-pane fade" class:active={tabSelect === 2} class:show={tabSelect === 2}>-->
          <!--            <div class="row">-->
          <!--              <div class="form-group  col-12">-->
          <!--                <label for="startBalance">Saldo Awal</label>-->
          <!--                <InputRp id="startBalance" class="form-control" name="startBalance" signed disabled={isUpdate} />-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="row">-->
          <!--              <div class="form-group  col-12">-->
          <!--                <label for="startDateBalance">Per Tanggal</label>-->
          <!--                <InputDate id="startDateBalance" name="startDateBalance" class="form-control" placeholder="Tanggal" disabled={isUpdate} />-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
      Cancel
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={loading} on:click={submitHandler}>
      <i class="fal fa-save mr-2" />
      Save
    </button>
  </svelte:fragment>
</Modal>
