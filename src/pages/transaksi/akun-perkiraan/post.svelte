<!--routify:options title="form"-->
<script lang="ts">
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import { onMount } from "svelte";
  import { url, params, goto } from "@roxi/routify";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import { getAccountContext } from "__@modules/transaksi";
  import { get, writable } from "svelte/store";

  const {
    accountStore,
    createAccount,
    updateAccount,
    accountTypeStore,
    getAccountType,
    getAccount
  } = getAccountContext();
  let formStore: FormStore;
  let formEl: HTMLFormElement;
  let account;
  let loading: boolean = false;

  onMount(() => {
    formStore.addField("type");
  });

  $: {
    if ($params.id) {
      account = getAccount($params.id);
      if (formStore) {
        formStore.setValues($account);
      }
    }
  }

  function changeAccountValueHandler(e) {
    const value = e.detail;
    if (formStore) {
      formStore.setValue("type", value.id);
      if (formStore.isTouched("type")) {
        formStore.validateField("type");
      }
    }
  }

  function saveHandler(e) {
    formStore.submit(async (values: any) => {
      try {
        if ($account) {
          delete values.id;
          await updateAccount($account.id, values);
        } else {
          await createAccount(values);
        }
        $goto("./");
      } catch (e) {
        console.error(e);
      }
    });
  }

  function cancelHandler() {
    $goto("./");
  }

</script>

<PageLayout breadcrumb={{ title: 'Form Akun perkiraan', path: $url('./') }}>
  <div class="header-elements" slot="header-elements">
    <!--    <a-->
    <!--      href={$url('./')}-->
    <!--      class="btn btn-link btn-float text-default"-->
    <!--      target="_self"-->
    <!--      on:click|preventDefault={submitHandler}>-->
    <!--      <Icon class="text-primary" size="large" component={SaveIcon} />-->
    <!--    </a>-->
  </div>

  <Form bind:formStore bind:ref={formEl}>
    <div class="d-flex flex-column h-100">
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label for="code">Kode</label>
            <InputField id="code" name="code" type="text" class="form-control" placeholder="Kode" />
          </div>
          <div class="form-group">
            <label for="name">Nama</label>
            <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
          </div>
          <div class="form-group">
            <div>Jenis Akun</div>
            <AutoComplete
              selectedItem={$account && getAccountType($account.type)}
              on:change={changeAccountValueHandler}
              inputClassName="form-control"
              placeholder="Jenis Akun"
              items={$accountTypeStore}
              labelFunction={(accountType) => (accountType ? `${accountType.code} ${accountType.name}` : null)}
              keywordsFunction={(accountType) => (accountType ? `${accountType.code} ${accountType.name}` : null)} />
          </div>
        </div>
        <div class="card-footer d-flex">
          <div class="flex-grow-1">&nbsp;</div>
          <div>
            <button class="btn btn-outline bg-pink-400 text-pink-400 border-pink-400" on:click={cancelHandler}>
              Cancel
            </button>
            <button class="btn btn-primary ml-1" on:click={saveHandler} disabled={loading}>
              <SaveIcon class="mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </Form>
</PageLayout>
