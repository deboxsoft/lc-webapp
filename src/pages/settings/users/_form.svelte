<script>
  import * as z from "@deboxsoft/zod";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";

  export const schema = z.object({
    username: z.string().min(5).nonempty(),
    password: z.string().min(5).nonempty(),
    name: z.string().nonempty(),
    email: z.string().email()
  });
  export let fields;
  export let user = {};
  export let isNew = false;
</script>

<Form bind:fields values={user}>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="username">Username</label>
          <InputField id="username" name="username" type="text" class="form-control" placeholder="Username" />
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
    </div>
  </div>
</Form>
