<!--routify:options title="menu"-->
<script lang="ts">
  import MenuOpen from "@deboxsoft/svelte-icons/MenuOpen.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import CardMenuContainer from "__@comps/CardMenuContainer.svelte";
  import CardMenu from "__@comps/CardMenu.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <CardMenuContainer>
    <CardMenu label="Laba Rugi" path="./laba-rugi">
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Aktiva Tetap" path="./aktiva-tetap" >
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Neraca" path="./neraca" >
      <MenuOpen />
    </CardMenu>
  </CardMenuContainer>
</PageLayout>
