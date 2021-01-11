<!--routify:options title="Form Akun Perkiraan"-->
<script lang="ts">
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import { url } from "@roxi/routify";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import SaveIcon from "@deboxsoft/svelte-icons/SaveTwoTone.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";

  let formStore: FormStore;
</script>

<PageLayout>
  <div class="header-elements" slot="header-elements">
    <a href={$url('/jurnal/posting')} class="btn btn-link btn-float text-default">
      <Icon class="text-primary" size="large" component={SaveIcon} />
    </a>
  </div>
  <Form bind:formStore>
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
            <AutoComplete inputClassName="form-control" placeholder="Jenis Akun" />
          </div>
        </div>
      </div>
    </div>
  </Form>
</PageLayout>
