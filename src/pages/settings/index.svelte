<script>
  import { derived, writable } from "svelte/store";
  import { goto, params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";

  const { load, save } = stores.getPreferenceAccountingContext() || {};
  $: url = $params.backUrl || "./";

  async function saveHandler() {
    $goto(url, {}, true);
  }

  function closeHandler() {
    $goto(url, {}, true);
  }
</script>

  <form>
    <div class="row">
      <div class="container">
        <class class="form-group col-12">
        </class>
      </div>
    </div>
    <div class="bootstrap-duallistbox-container row moveonselect">
      <div class="box1 col-12">
      </div>
    </div>
  </form>
