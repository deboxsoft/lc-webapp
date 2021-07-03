<script>
  import * as z from "@deboxsoft/zod";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import { getUserContext } from "__@modules/users";

  const { groupStore } = getUserContext();

  export let isUpdate = false;
  export let submitHandler;
  export const schema = z.object({
    username: isUpdate ? z.string().optional().nullable() : z.string().min(5).nonempty(),
    password: isUpdate ? z.string().optional().nullable() : z.string().min(5).nonempty(),
    name: z.string().nonempty(),
    email: z.string().email()
  });
  export let user = {};
  export let fields;
</script>

<Form bind:fields values={user} {schema} bind:submitHandler>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="username">Username</label>
          <InputField
            id="username"
            name="username"
            type="text"
            class="form-control"
            placeholder="Username"
            disabled={isUpdate}
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="password">Passsword</label>
          <InputField
            id="password"
            name="password"
            type="password"
            autocomplete="password"
            class="form-control"
            placeholder="Password"
            disabled={isUpdate}
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="name">Nama</label>
          <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="email">Email</label>
          <InputField id="email" name="email" type="text" class="form-control" placeholder="Email" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="group">Group</label>
          <ComboxField id="group" items={$groupStore} name="groupId" labelId="name" />
        </div>
      </div>
    </div>
  </div>
</Form>
