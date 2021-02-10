<!--routify:options title="menu"-->
<script lang="ts">
  import MenuOpen from "@deboxsoft/svelte-icons/MenuOpen.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import CardMenuContainer from "__@comps/CardMenuContainer.svelte";
  import CardMenu from "__@comps/CardMenu.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <CardMenuContainer>
    <CardMenu label="Akumulasi" path="./akumulasi">
      <MenuOpen />
    </CardMenu>
    <CardMenu label="BDD" path="./bdd" >
      <MenuOpen />
    </CardMenu>
  </CardMenuContainer>
</PageLayout>
