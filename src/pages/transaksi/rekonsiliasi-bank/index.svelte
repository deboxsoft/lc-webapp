<!--routify:options title="tabel"-->
<script lang="ts">
  import PageLayout from "__@root/layout/PageLayout.svelte";

  // import Dropzone from "__@comps/"
  // .trim().replace(/\s+/g, ' ')
  function fileChangeHandler(e) {
    const file = e?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (_) => {
        console.log(_.target.result);
      };
      reader.readAsText(file, "UTF-8");
    }
  }
</script>

<PageLayout breadcrumb={[]}><input type="file" on:change={fileChangeHandler} /></PageLayout>
