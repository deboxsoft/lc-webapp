<script>
  import {onMount} from "svelte";
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { createUIContext as createContextStore } from "__@root/stores/ui";

  const { store: uiStore } = createContextStore();

  const BodyClass = (el, { isDark = false, minimizeSidebar, showMobileSidebar }) => {
    const darkClass = "-dark";
    const minimizeSidebarClass = "sidebar-xs";
    const showMobileSidebarClass = "sidebar-mobile-main";
    document.body.classList.add("dbx-theme");
    isDark && document.body.classList.add(darkClass);
    minimizeSidebar && document.body.classList.add(minimizeSidebarClass);
    showMobileSidebar && document.body.classList.add(showMobileSidebarClass);

    return {
      update({ isDark, minimizeSidebar, showMobileSidebar, modalOpen }) {
        isDark ? document.body.classList.add(darkClass) : document.body.classList.remove(darkClass);
        minimizeSidebar
          ? document.body.classList.add(minimizeSidebarClass)
          : document.body.classList.remove(minimizeSidebarClass);
        showMobileSidebar
          ? document.body.classList.add(showMobileSidebarClass)
          : document.body.classList.remove(showMobileSidebarClass);
        modalOpen ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open");
      }
    };
  };
  // @ts-ignore
  setTimeout(() => window.routify.inBrowser);
</script>

<div use:BodyClass={$uiStore}>
  <Router {routes} />
</div>
