<script>
  import * as z from "@deboxsoft/zod";
  import Form from "__@comps/forms/Form.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getAccessControlContext } from "__@modules/users";

  const { grants } = getAccessControlContext();
  $: roles = Object.keys($grants);
  export const schema = z.object({
    name: z.string().nonempty("nama wajib diisi")
  });

  export let fields;
  export let groupUser = {};
  export let isNew = false;
  export let submitHandler;
</script>

<Form bind:fields values={groupUser} {schema} bind:submitHandler>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="name">Nama</label>
          <InputField id="name" name="name" type="text" class="form-control" placeholder="Name" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="role">Role</label>
          <ComboxField id="role" items={roles} name="role" />
        </div>
      </div>
    </div>
  </div>
</Form>
